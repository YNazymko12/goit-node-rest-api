import express from 'express';

import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';
import authControllers from '../controllers/authControllers.js';
import validateBody from '../decorators/validateBody.js';

import {
  authRegisterSchema,
  authLoginSchema,
  emailSchema,
} from '../schemas/authSchemas.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  authControllers.registerController
);

authRouter.post(
  '/login',
  validateBody(authLoginSchema),
  authControllers.loginController
);

authRouter.post('/logout', authenticate, authControllers.logoutController);

authRouter.get('/current', authenticate, authControllers.getCurrentController);

authRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  authControllers.updateAvatarController
);

authRouter.get('/verify/:verificationToken', authControllers.verifyEmail);

authRouter.post(
  '/verify',
  validateBody(emailSchema),
  authControllers.resendVerificationEmail
);
export default authRouter;
