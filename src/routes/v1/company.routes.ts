import express, {Request, Response} from 'express';
import { companyController } from '~/controllers/company.controller';

const Router = express.Router();

Router.route('/')
  .get(companyController.getDetail)
  // .post(companyController.createNew);

export const companyRoute = Router;