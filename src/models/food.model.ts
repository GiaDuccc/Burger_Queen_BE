import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { foodEntity } from '~/types/food/food.entity'
import { createFoodRequest } from '~/types/food/food.request'
import { InsertOneResult, ObjectId } from 'mongodb'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes'

const FOOD_COLLECTION_NAME = 'foods'
const FOOD_COLLECTION_SCHEMA = Joi.object({
  foodName: Joi.string().min(3).max(256).required(),
  foodType: Joi.string().min(3).max(256).valid('burger', 'chicken', 'drink', 'chips').required(),
  favor: Joi.string().min(3).max(256).required(),
  price: Joi.number().min(0).required(),
  status: Joi.boolean().default(true),
  createdAt: Joi.date().default(new Date()),
  updatedAt: Joi.date().default(new Date())
})

const validateBeforeCreate = async (food: createFoodRequest): Promise <foodEntity> => {
  return await FOOD_COLLECTION_SCHEMA.validateAsync(food, { abortEarly: false });
}

const createNew = async (data: createFoodRequest): Promise<InsertOneResult<foodEntity>> => {
  const validatedFood = await validateBeforeCreate(data);

  const existedFood = await GET_DB().collection<foodEntity>(FOOD_COLLECTION_NAME).findOne({
    foodName: validatedFood.foodName
  });
  if (existedFood) {
    throw new ApiError(StatusCodes.CONFLICT, 'Food is already existed');
  }

  const result = await GET_DB().collection<foodEntity>(FOOD_COLLECTION_NAME).insertOne(validatedFood);
  return result;
}

const findOneById = async (foodId: string): Promise<foodEntity | null> => {
  try {
    console.log("foodId: ", foodId);
    return await GET_DB().collection<foodEntity>(FOOD_COLLECTION_NAME).findOne({
      _id: new ObjectId(foodId)
    });
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "No food found");
  }
}

const getAllFood = async (): Promise<foodEntity[]> => {
  try {
    return await GET_DB().collection<foodEntity>(FOOD_COLLECTION_NAME).find({}).toArray();
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "No food found");
  }
}

export const foodModel = {
  createNew,
  findOneById,
  getAllFood
}