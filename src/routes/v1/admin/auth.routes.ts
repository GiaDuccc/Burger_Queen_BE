import express from 'express';
import { authController } from '~/controllers/auth.controller';
import { authenticateToken, authenticateTokenAdmin, authorizeRoles } from '~/middlewares/auth.middleware';

const Router = express.Router();

// Router.route('/signIn')
//   .post(authController.signIn);

// Router.route('/signUp')
//   .post(userValidation.createNew , authController.signUp);

// Router.route('/signOut')
//   .post(authenticateToken, authController.signOut);

// Router.route('/refresh')
//   .post(authController.refresh);

Router.route('/myInfo')
  .get(authenticateTokenAdmin, authController.getMyInfoEmployee);

Router.route('/signInAdmin')
  .post(authController.signInAdmin);

Router.route('/refreshAdmin')
  .post(authController.refreshAdmin);


export const authRoute = Router;