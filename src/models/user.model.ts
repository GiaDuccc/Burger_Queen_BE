import { userEntity } from "~/types/user/user.entity"
import { InsertOneResult, ObjectId } from "mongodb"
import { GET_DB } from "~/config/mongodb"
import ApiError from "~/utils/ApiError"
import { StatusCodes } from "http-status-codes/build/cjs/status-codes"
import Joi, { valid } from "joi"
import { createUserRequest } from "~/types/user/user.request"

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(10).max(15).required(),
  address: Joi.string().min(3).max(256).required(),
  password: Joi.string().min(6).required(),
  userType: Joi.string().valid('manager', 'admin', 'customer').default('customer'),
  status: Joi.boolean().default(true),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date())
});

const validateBeforeCreate = async (user: createUserRequest): Promise<userEntity> => {
  return await USER_COLLECTION_SCHEMA.validateAsync(user, { abortEarly: false })
}

const createNew = async (user: createUserRequest): Promise<InsertOneResult> => {
  try {
    const validUser = await validateBeforeCreate(user)

    const existedUser = await GET_DB().collection<userEntity>(USER_COLLECTION_NAME).findOne({
      $or: [
        { email: user.email },
        { phoneNumber: user.phoneNumber }
      ]
    })
    if (existedUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'User already exists')
    }
    return await GET_DB().collection<userEntity>(USER_COLLECTION_NAME).insertOne(validUser)
  } catch (error: any) {
    throw new Error(error)
  }
}

const findOneById = async (userId: string): Promise<userEntity | null> => {
  try {
    return await GET_DB().collection<userEntity>(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(userId) })
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "User not found")
  }
}

const getAllUser = async (): Promise <userEntity[]> => {
  try {
    return await GET_DB().collection<userEntity>(USER_COLLECTION_NAME).find().toArray();
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}

export const userModel = {
  createNew,
  getAllUser,
  findOneById
}