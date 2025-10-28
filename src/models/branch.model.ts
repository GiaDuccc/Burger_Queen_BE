import { branchEntity } from "~/types/branch/branch.entity"
import { GET_DB } from "~/config/mongodb"
import { InsertOneResult, ObjectId } from "mongodb"
import ApiError from "~/utils/ApiError"
import { StatusCodes } from "http-status-codes/build/cjs/status-codes"
import { createBranchRequest } from "~/types/branch/branch.request"
import Joi from "joi"
import { OBJECT_ID_RULE } from "~/utils/validators"

const BRANCH_COLLECTION_NAME = 'branches'
const BRANCH_COLLECTION_SCHEMA = Joi.object({
  companyId: Joi.string().pattern(OBJECT_ID_RULE).required(),
  branchName: Joi.string().min(3).max(256).required(),
  city: Joi.string().min(2).max(100).required(),
  address: Joi.string().min(3).required(),
  phoneNumber: Joi.string().min(10).max(15).pattern(/^\+?[0-9]{10,15}$/).required(),
  openTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  closeTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  status: Joi.boolean().default(true),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date()),
});

const validateBeforeCreate = async (branch: createBranchRequest): Promise <branchEntity> => {
  return await BRANCH_COLLECTION_SCHEMA.validateAsync(branch, { abortEarly: false });
}

const createNew = async (branch: createBranchRequest): Promise<InsertOneResult<branchEntity>> => {
  try {
    const validBranch = await validateBeforeCreate(branch);

    const existedBranch = await GET_DB().collection<branchEntity>(BRANCH_COLLECTION_NAME).findOne({
      branchName: validBranch.branchName
    })
    if (existedBranch) {
      throw new ApiError(StatusCodes.CONFLICT, 'Branch is already existed');
    }
    return await GET_DB().collection<branchEntity>(BRANCH_COLLECTION_NAME).insertOne({
      ...validBranch,
      companyId: new ObjectId(validBranch.companyId)
    })
  } catch (error: any) { throw new Error(error) }
}

const findOneById = async (branchId: string): Promise<branchEntity | null> => {
  try {
    return await GET_DB().collection <branchEntity> (BRANCH_COLLECTION_NAME).findOne({ 
      _id: new ObjectId(branchId)
     })
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Khong tim thay branch nao")
  }
}

const getAllBranch = async (): Promise<branchEntity[]> => {
  try {
    return await GET_DB().collection<branchEntity>(BRANCH_COLLECTION_NAME).find({}).toArray();
  } catch (error: any) {
    throw new Error(error)
  }
}

const getAllCities = async (): Promise<string[]> => {
  try {
    const cities = await GET_DB().collection<branchEntity>(BRANCH_COLLECTION_NAME).aggregate([
      {
        $group: { _id: "$city" }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: { _id: 0, city: "$_id" }
      }
    ]).toArray();
    
    return cities.map(item => item.city);
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "No cities found");
  }
}

const getBranchByCity = async (city: string): Promise<branchEntity[]> => {
  try {
    return await GET_DB().collection<branchEntity>(BRANCH_COLLECTION_NAME).find({ city: city }).toArray();
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "No branches found for the specified city");
  }
}

export const branchModel = {
  createNew,
  findOneById,
  getAllBranch,
  getAllCities,
  getBranchByCity
};