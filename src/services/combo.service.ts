import { createComboRequest } from "~/types/combo/combo.request"
import { createComboResponse } from "~/types/combo/combo.response"
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { comboModel } from "~/models/combo.model";
const createNew = async (reqBody: createComboRequest): Promise<createComboResponse> => {
  try {
    const result = await comboModel.createNew(reqBody);
    const newCombo = await comboModel.findOneById(result.insertedId.toString());
  
    if (!newCombo) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Create combo failed');
  
    return newCombo;
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}

const updateCombo = async (comboId: string, reqBody: createComboRequest): Promise<createComboResponse> => {
  try {
    const result = await comboModel.updateCombo(comboId, reqBody);

    if (!result.acknowledged) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Update combo failed');
    }
    const updatedCombo = await comboModel.findOneById(comboId);

    if (!updatedCombo) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Combo not found');

    return updatedCombo;
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}

export const comboService = {
  createNew,
  updateCombo
}