import express from 'express';
import { foodController } from '~/controllers/food.controller';
import { authenticateTokenAdmin, authorizeRoles } from '~/middlewares/auth.middleware';
import { foodValidation } from '~/validations/food.validation';

const Router = express.Router();

Router.use(authenticateTokenAdmin);

Router.route('/')
  .get(foodController.getAllFood)
  .post( authorizeRoles('admin', 'manager'), foodValidation.createNew, foodController.createNew);

Router.route('/getFoodType')
  .get(foodController.getFoodType);

Router.route('/getAllFoodbyType')
  .get(foodController.getAllFoodbyType);

Router.route('/searchFood')
  .get(foodController.searchFood);

Router.route('/:id')
  .get(foodController.getFoodDetail)
  .put(authorizeRoles('admin', 'manager'), foodValidation.createNew, foodController.updateFood)
  .delete(authorizeRoles('admin', 'manager'), foodController.deleteFood);

export const foodRoute = Router;