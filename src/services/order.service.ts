import { StatusCodes } from "http-status-codes";
import { orderModel } from "~/models/order.model"
import { createOrderRequest } from "~/types/order/order.request"
import ApiError from "~/utils/ApiError";

const createNew = async (orderData: createOrderRequest) => {
  try {
    const newOrder = await orderModel.createNew(orderData);
    const result = await orderModel.findOneById(newOrder.insertedId.toString());
    return result;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create order');
  }
}

export const orderService = {
  createNew
}