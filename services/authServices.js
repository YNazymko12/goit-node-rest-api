import bcrypt from 'bcrypt';
import gravatar from 'gravatar';
import { generateToken } from '../helpers/jwt.js';
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';

import User from '../db/models/User.js';
import HttpError from '../helpers/HttpError.js';
import { sendVerificationEmail } from '../helpers/emailService.js';

export const findUser = query =>
  User.findOne({
    where: query,
  });

export const registerUser = async data => {
  const { email, password } = data;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (user) {
    throw HttpError(409, 'Email already in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email, { s: '100', d: 'identicon' }, true);

  const verificationToken = uuidv4();

  const newUser = await User.create({
    ...data,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  try {
    await sendVerificationEmail(newUser.email, verificationToken);
  } catch (error) {
    console.error('Failed to send verification email:', error.message);
  }

  return {
    email: newUser.email,
    subscription: newUser.subscription,
    avatarURL: newUser.avatarURL,
  };
};

export const loginUser = async data => {
  const { email, password } = data;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw HttpError(401, 'Email or password invalid');
  }

  if (!user.verify) {
    throw HttpError(
      401,
      'Email not verified. Please check your email to verify your account'
    );
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Email or password invalid');
  }

  const token = generateToken({ email });

  await user.update({ token });

  const { subscription, avatarURL } = user;

  return {
    token,
    user: { email, subscription, avatarURL },
  };
};

export const logoutUser = async id => {
  const user = await findUser({ id });
  if (!user || !user.token) {
    throw HttpError(404, 'User not found');
  }

  await user.update({ token: null });
};

export const updateUserAvatar = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw HttpError(404, 'User not found');
  }

  await user.update(data);
  return user;
};

export const verifyEmail = async verificationToken => {
  const user = await User.findOne({
    where: { verificationToken },
  });

  if (!user) {
    return null;
  }

  await user.update(
    {
      verify: true,
      verificationToken: null,
    },
    { where: { id: user.id } }
  );

  return user;
};

export const resendVerificationEmail = async email => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return null;
  }

  if (user.verify) {
    return { verified: true };
  }

  if (!user.verificationToken) {
    const verificationToken = uuidv4();
    await User.update({ verificationToken }, { where: { id: user.id } });

    await sendVerificationEmail(email, verificationToken);
    return { sent: true };
  }

  await sendVerificationEmail(email, user.verificationToken);
  return { sent: true };
};
