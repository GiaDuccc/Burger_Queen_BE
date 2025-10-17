import express, { Request, Response } from 'express';
import { userController } from '~/controllers/user.controller';
import { userValidation } from '~/validations/user.validation';

const Router = express.Router();

Router.route('/')
  .get(userController.getAllUser)
  .post(userValidation.createNew, userController.createNew);

Router.route('/myInfo')
  .get(userController.getMyInfo);

Router.route('/:id')
  .get(userController.getUserDetail);


export const userRoute = Router;
