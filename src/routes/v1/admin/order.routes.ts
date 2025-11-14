import express from 'express';
import { orderController } from '~/controllers/order.controller';
import { orderValidation } from '~/validations/order.validation';

const Router = express.Router();

Router.route('/')
  .get(orderController.getAllOrders)
  .post(orderValidation.createNew, orderController.createNew);

Router.route('/getAllOrderPage')
  .get(orderController.getAllOrderPage);

Router.route('/:id')
  .get(orderController.findOneById);


export const orderRoute = Router;