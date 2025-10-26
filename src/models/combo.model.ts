import { InsertOneResult, ObjectId, DeleteResult } from "mongodb"
import { comboEntity } from "~/types/combo/combo.entity"
import { createComboRequest } from "~/types/combo/combo.request"
import Joi from "joi"
import { GET_DB } from "~/config/mongodb"
import { OBJECT_ID_RULE } from "~/utils/validators"
import ApiError from "~/utils/ApiError"
import { StatusCodes } from "http-status-codes"

const COMBO_COLLECTION_NAME = 'combos';
const COMBO_COLLECTION_SCHEMA = Joi.object({
  comboName: Joi.string().min(3).max(256).required(),
  description: Joi.string().min(3).required(),
  price: Joi.number().min(0).required(),
  foods: Joi.array().items(
    Joi.object({
      foodId: Joi.string().pattern(OBJECT_ID_RULE).required(),
      quantity: Joi.number().min(1).required()
    })
  ),
  imageUrl: Joi.string().uri().required(),
  status: Joi.boolean().default(true),
  createdAt: Joi.date().default(new Date()),
  updatedAt: Joi.date().default(new Date())
})

const validateBeforeCreate = async (combo: createComboRequest): Promise<comboEntity> => {
  return await COMBO_COLLECTION_SCHEMA.validateAsync(combo, { abortEarly: false });
}

const createNew = async (data: createComboRequest): Promise<InsertOneResult<comboEntity>> => {
  const validatedCombo = await validateBeforeCreate(data);

  const existedCombo = await GET_DB().collection<comboEntity>(COMBO_COLLECTION_NAME).findOne({
    comboName: validatedCombo.comboName
  });

  if (existedCombo) {
    throw new ApiError(StatusCodes.CONFLICT, 'Combo is already existed');
  }

  return await GET_DB().collection<comboEntity>(COMBO_COLLECTION_NAME).insertOne(validatedCombo);
}

const findOneById = async (comboId: string): Promise<comboEntity | null> => {
  const idSchema = Joi.string().pattern(OBJECT_ID_RULE).required().messages({
    'string.pattern.base': 'Invalid combo ID format'
  });
  await idSchema.validateAsync(comboId);
  try {
    return await GET_DB().collection<comboEntity>(COMBO_COLLECTION_NAME).findOne({
      _id: new ObjectId(comboId)
    });
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to find combo');
  }
};

const getAllCombo = async (): Promise<comboEntity[]> => {
  return await GET_DB().collection<comboEntity>(COMBO_COLLECTION_NAME).find({}).toArray();
};

const deleteCombo = async (comboId: string): Promise<string> => {
  try {
    const result = await GET_DB().collection<comboEntity>(COMBO_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(comboId)
    });
    return `deleted ${result.deletedCount > 0 ? 'successfully' : 'failed'} ${result.deletedCount} document(s)`;
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const comboModel = {
  createNew,
  findOneById,
  getAllCombo,
  deleteCombo
}