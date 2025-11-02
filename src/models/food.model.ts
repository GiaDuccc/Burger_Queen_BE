import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { foodEntity } from '~/types/food/food.entity'
import { createFoodRequest } from '~/types/food/food.request'
import { Document, InsertOneResult, ObjectId, UpdateResult} from 'mongodb'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes/build/cjs/status-codes'

const FOOD_COLLECTION_NAME = 'foods'
const FOOD_COLLECTION_SCHEMA = Joi.object({
  foodName: Joi.string().min(3).max(256).required(),
  normalizedName: Joi.string().min(3).max(256).required(),
  foodType: Joi.string().min(3).max(256).valid('burger', 'chicken', 'drink', 'fries').required(),
  description: Joi.string().min(3).required(),
  favor: Joi.string().min(3).max(256).required(),
  price: Joi.number().min(0).required(),
  imageUrl: Joi.string().uri().required(),
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

const getAllFoodbyType = async (foodType: string): Promise<foodEntity[]> => {
  try {
    return await GET_DB().collection<foodEntity>(FOOD_COLLECTION_NAME).find({ foodType: foodType }).toArray();
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "No food found");
  }
}

const getFoodType = async (): Promise<Document[]> => {
  try {
    const foodTypes = await GET_DB().collection(FOOD_COLLECTION_NAME).aggregate([
      {
        $group: { _id: "$foodType" }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: { _id: 0, foodType: "$_id" }
      }
    ]).toArray();
    return foodTypes;
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "No food type found");
  }
}

const deleteFood = async (foodId: string): Promise<string> => {
  try {
    const result = await GET_DB().collection<foodEntity>(FOOD_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(foodId)
    });
    return `deleted ${result.deletedCount > 0 ? 'successfully' : 'failed'} ${result.deletedCount} document(s)`;
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "No food found to delete by id");
  }
}

const searchFood = async (keyword: string): Promise<foodEntity[]> => {
  const result = await GET_DB().collection<foodEntity>(FOOD_COLLECTION_NAME).find({
    $or: [
      { foodName: { $regex: keyword, $options: 'i' } },
      { foodType: { $regex: keyword, $options: 'i' } },
      { normalizedName: { $regex: keyword, $options: 'i' } },
    ]
  }).toArray();
  return result;
}

const updateFood = async (foodId: string, data: createFoodRequest): Promise<UpdateResult> => {
  const validatedFood = await validateBeforeCreate(data);

  const result = await GET_DB().collection<foodEntity>(FOOD_COLLECTION_NAME).updateOne(
    { _id: new ObjectId(foodId) },
    { $set: { ...validatedFood, updatedAt: new Date() } }
  );

  return result;
};

export const foodModel = {
  createNew,
  findOneById,
  getAllFood,
  getAllFoodbyType,
  getFoodType,
  deleteFood,
  searchFood,
  updateFood
}