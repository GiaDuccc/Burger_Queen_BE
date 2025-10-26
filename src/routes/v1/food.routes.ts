import express, {Request, Response} from 'express';
import { foodController } from '~/controllers/food.controller';
import { foodValidation } from '~/validations/food.validation';

const Router = express.Router();

Router.route('/')
  .get(foodController.getAllFood)
  .post(foodValidation.createNew, foodController.createNew);

Router.route('/searchFood')
  .get(foodController.searchFood);

Router.route('/getFoodType')
  .get(foodController.getFoodType);

Router.route('/getAllFoodbyType')
  .get(foodController.getAllFoodbyType);

Router.route('/:id')
  .get( foodController.getFoodDetail)
  .delete(foodController.deleteFood);

export const foodRoute = Router;