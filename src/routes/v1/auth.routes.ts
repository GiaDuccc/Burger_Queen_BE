import express from 'express';
import { authController } from '~/controllers/auth.controller';
import { userValidation } from '~/validations/user.validation';

const Router = express.Router();

Router.route('/signIn')
  .post(authController.signIn);

Router.route('/signUp')
  .post(userValidation.createNew , authController.signUp);


export const authRoute = Router;