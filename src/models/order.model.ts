import Joi from "joi";
import { InsertOneResult, ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb"
import { orderEntity } from "~/types/order/order.entity";
import { createOrderRequest } from "~/types/order/order.request";
import { orderResponse } from "~/types/order/order.response";
import { OBJECT_ID_RULE } from "~/utils/validators";

const ORDER_COLLECTION_NAME = 'orders'
const ORDER_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).required(),
  employeeId: Joi.string().pattern(OBJECT_ID_RULE).optional(),
  branchId: Joi.string().pattern(OBJECT_ID_RULE).required(),
  items: Joi.array().items(
    Joi.object({
      itemType: Joi.string().valid("food", "combo").required(),
      itemId: Joi.string().pattern(OBJECT_ID_RULE).required(),
      quantity: Joi.number().min(1).required(),
      price: Joi.number().min(0).required()
    })
  ).required(),
  total: Joi.number().min(0).required(),
  status: Joi.string().valid("pending", "processing", "completed", "cancelled").optional().default("pending"),
  createdAt: Joi.date().default(new Date()),
  updatedAt: Joi.date().default(new Date())
})

const validateBeforeCreate = async (order: createOrderRequest): Promise<orderEntity> => {
  return await ORDER_COLLECTION_SCHEMA.validateAsync(order, { abortEarly: false });
}

const createNew = async (data: createOrderRequest): Promise<InsertOneResult<orderEntity>> => {
  const validatedOrder = await validateBeforeCreate(data);
  return await GET_DB().collection<orderEntity>(ORDER_COLLECTION_NAME).insertOne({
    ...validatedOrder,
    userId: new ObjectId(validatedOrder.userId.toString()),
    employeeId: validatedOrder.employeeId ? new ObjectId(validatedOrder.employeeId.toString()) : undefined,
    branchId: new ObjectId(validatedOrder.branchId.toString()),
    items: validatedOrder.items.map(item => ({
      ...item,
      itemId: new ObjectId(item.itemId.toString())
    }))
  });
}

const findOneById = async (orderId: string): Promise<orderResponse | null> => {
  return await GET_DB().collection<orderResponse>(ORDER_COLLECTION_NAME).findOne({
    _id: new ObjectId(orderId)
  });
}

const getAllOrders = async (): Promise<orderResponse[]> => {
  return await GET_DB().collection<orderEntity>(ORDER_COLLECTION_NAME).find().toArray();
}

const getAllOrderPage = async (filter: string, skip: number, limit: number, branchId: string): Promise<{
  orders: orderResponse[];
  totalRecords: number
}> => {
    const query: any = {};
    if (branchId) {
      query.branchId = new ObjectId(branchId);
    }
  
    let sortOrder: any = {};
    if (filter === "newest") {
      sortOrder = { createdAt: -1 };
    } else if (filter === "oldest") {
      sortOrder = { createdAt: 1 };
    }
  
    const orders = await GET_DB().collection<orderResponse>(ORDER_COLLECTION_NAME).find(query)
      .sort(sortOrder) // Sắp xếp theo thứ tự đã chỉ định
      .skip(skip)
      .limit(limit) // Loại bỏ trường password
      .toArray() as orderResponse[];
  
    const totalRecords = await GET_DB().collection<orderResponse>(ORDER_COLLECTION_NAME).countDocuments({ status: true });
    return { orders, totalRecords };
}

export const orderModel = {
  getAllOrders,
  createNew,
  findOneById,
  getAllOrderPage
}