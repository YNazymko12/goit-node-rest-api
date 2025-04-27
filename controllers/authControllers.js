import fs from 'fs/promises';
import path from 'path';
import HttpError from '../helpers/HttpError.js';
import * as authServices from '../services/authServices.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';

const registerController = async (req, res) => {
  const { email, subscription, avatarURL } = await authServices.registerUser(
    req.body
  );

  res.status(201).json({
    user: {
      email,
      subscription,
      avatarURL,
    },
  });
};

const loginController = async (req, res) => {
  const { token, user } = await authServices.loginUser(req.body);

  res.status(200).json({
    token,
    user,
  });
};

const logoutController = async (req, res) => {
  const { id } = req.user;
  await authServices.logoutUser(id);

  res.status(204).json({
    message: 'Logout successfully',
  });
};

const getCurrentController = (req, res) => {
  const { email, subscription, avatarURL } = req.user;

  res.json({
    email,
    subscription,
    avatarURL,
  });
};

export const updateAvatarController = ctrlWrapper(async (req, res) => {
  if (!req.user) {
    throw HttpError(401, 'Not authorized');
  }

  if (!req.file) {
    throw HttpError(400, 'Avatar file is required');
  }

  const { id, avatarURL: oldAvatarURL } = req.user;

  const { path: tempPath, originalname } = req.file;
  const timestamp = Date.now();
  const fileName = `${id}_${timestamp}_${originalname}`;

  const avatarsDir = path.resolve('public', 'avatars');
  const finalPath = path.join(avatarsDir, fileName);

  if (oldAvatarURL) {
    const oldFileName = path.basename(oldAvatarURL);
    if (oldFileName !== fileName) {
      const oldFilePath = path.join(avatarsDir, oldFileName);
      try {
        await fs.unlink(oldFilePath);
      } catch (error) {
        console.log(`Failed to delete old avatar: ${error.message}`);
      }
    }
  }

  await fs.rename(tempPath, finalPath);

  const newAvatarURL = `/avatars/${fileName}`;
  await authServices.updateUserAvatar(id, { avatarURL: newAvatarURL });

  res.status(200).json({ avatarURL: newAvatarURL });
});

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await authServices.verifyEmail(verificationToken);
  if (!user) {
    throw HttpError(404, 'User not found');
  }

  res.status(200).json({
    message: 'Verification successful',
  });
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw HttpError(400, 'missing required field email');
  }

  const result = await authServices.resendVerificationEmail(email);

  if (!result) {
    throw HttpError(404, 'User not found');
  }

  if (result.verified) {
    throw HttpError(400, 'Verification has already been passed');
  }

  res.status(200).json({
    message: 'Verification email sent',
  });
};

export default {
  registerController: ctrlWrapper(registerController),
  loginController: ctrlWrapper(loginController),
  logoutController: ctrlWrapper(logoutController),
  getCurrentController: ctrlWrapper(getCurrentController),
  updateAvatarController: ctrlWrapper(updateAvatarController),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerificationEmail: ctrlWrapper(resendVerificationEmail),
};
