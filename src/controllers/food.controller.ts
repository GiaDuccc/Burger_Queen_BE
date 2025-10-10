import { Request, Response, NextFunction } from 'express';
import { get } from 'http';
import { StatusCodes } from 'http-status-codes';
import { foodModel } from '~/models/food.model';
import { foodService } from '~/services/food.services';
import ApiError from '~/utils/ApiError';

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await foodService.createNew(req.body);
    res.status(StatusCodes.CREATED).json(result);
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

const getFoodDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const foodId = req.params.id;
    const result = await foodModel.findOneById(foodId);
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

const getAllFood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await foodModel.getAllFood();
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

export const foodController = {
  createNew,
  getFoodDetail,
  getAllFood
};