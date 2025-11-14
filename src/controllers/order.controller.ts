import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { orderModel } from '~/models/order.model';
import { orderService } from '~/services/order.service';

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderData = req.body;
    const newOrder = await orderService.createNew(orderData);
    res.status(StatusCodes.CREATED).json(newOrder);
  } catch (error) {
    next(error);
  }
}

const findOneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.id;
    const order = await orderModel.findOneById(orderId);
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Order not found' });
    }
    res.status(StatusCodes.OK).json(order);
  } catch (error) {
    next(error);
  }
}

const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderModel.getAllOrders();
    res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    next(error)
  }
}

const getAllOrderPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter = req.query.filter as string || "";
    const branchId = req.query.branchId as string || "";
    const skip = (page - 1) * limit;
    
    const orders = await orderModel.getAllOrderPage(filter, skip, limit, branchId);
    res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    next(error);
  }
}

export const orderController = {
  getAllOrders,
  createNew,
  findOneById,
  getAllOrderPage
};