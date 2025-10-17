import express from 'express';
import { authController } from '~/controllers/auth.controller';
import { authenticateToken, authorizeRoles } from '~/middlewares/auth.middleware';
import { userValidation } from '~/validations/user.validation';

const Router = express.Router();

Router.route('/signIn')
  .post(authController.signIn);

Router.route('/signUp')
  .post(userValidation.createNew , authController.signUp);

Router.route('/signOut')
  .post(authenticateToken, authController.signOut);


export const authRoute = Router;