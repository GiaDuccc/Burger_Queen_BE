import { createComboRequest } from "~/types/combo/combo.request"
import { createComboResponse } from "~/types/combo/combo.response"
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { comboModel } from "~/models/combo.model";
import { ObjectId } from "mongodb";
const createNew = async (reqBody: createComboRequest): Promise<createComboResponse> => {
  try {
    const result = await comboModel.createNew(reqBody);
    const newCombo = await comboModel.findOneById(result.insertedId.toString());
  
    if (!newCombo) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Create combo failed');
  
    const { _id, ...rest } = newCombo;
    
    return {
      comboId: newCombo._id as ObjectId,
      ...rest,
    }
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}

export const comboService = {
  createNew
}