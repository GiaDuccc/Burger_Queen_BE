import express, {Request, Response} from 'express';
import { foodController } from '~/controllers/food.controller';
import { foodValidation } from '~/validations/food.validation';

const Router = express.Router();

Router.route('/')
  .get(foodController.getAllFood)
  .post(foodValidation.createNew, foodController.createNew);

Router.route('/:id')
  .get(foodController.getFoodDetail);

export const foodRoute = Router;