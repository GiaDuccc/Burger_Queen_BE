import { StatusCodes } from 'http-status-codes';
import { foodModel } from '~/models/food.model';
import { foodEntity } from '~/types/food/food.entity';
import { createFoodRequest } from '~/types/food/food.request';
import { createFoodResponse } from '~/types/food/food.response';
import ApiError from '~/utils/ApiError';

/**
 * Tạo món ăn mới
 * @param reqBody - Dữ liệu món ăn cần tạo
 * @returns Promise<Food> - Món ăn vừa được tạo
 */
export const createNew = async (reqBody: createFoodRequest): Promise<createFoodResponse> => {
  try {
    const result = await foodModel.createNew(reqBody);
    const newFood = await foodModel.findOneById(result.insertedId.toString());

    if (!newFood) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Create food failed');

    return newFood;

  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Food creation failed: ${error.message}`);
  }
};

export const foodService = {
  createNew
};