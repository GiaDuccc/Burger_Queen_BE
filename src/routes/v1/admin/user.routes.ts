import express from 'express';
import { userController } from '~/controllers/user.controller';
import { authenticateTokenAdmin, authorizeRoles } from '~/middlewares/auth.middleware';
import { userValidation } from '~/validations/user.validation';

const Router = express.Router();

Router.use(authenticateTokenAdmin);

Router.route('/')
  .get(userController.getAllUser)
  .post(authorizeRoles('admin', 'manager'), userValidation.createNew, userController.createNew);

Router.route('/myInfo')
  .get(userController.getMyInfo);

Router.route('/:id')
  .get(authorizeRoles('admin', 'manager'), userController.getUserDetail);


export const userRoute = Router;
