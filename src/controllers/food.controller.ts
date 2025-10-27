import { Request, Response, NextFunction } from 'express';
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

const getAllFoodbyType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const foodType = req.query.foodType as string;
    const result = await foodModel.getAllFoodbyType(foodType);
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

const getFoodType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await foodModel.getFoodType();
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
}

const deleteFood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const foodId = req.params.id;
    console.log(foodId)
    const result = await foodModel.deleteFood(foodId);
    res.status(StatusCodes.OK).json({ message: result });
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

const searchFood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const keyword = req.query.keyword as string;
    if (!keyword) return res.json([]);
    const result = await foodModel.searchFood(keyword);
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

const updateFood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const foodId = req.params.id;
    const updatedFood = await foodService.updateFood(foodId, req.body);
    res.status(StatusCodes.OK).json(updatedFood);
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
}

export const foodController = {
  createNew,
  getFoodDetail,
  getAllFood,
  getAllFoodbyType,
  getFoodType,
  deleteFood,
  searchFood,
  updateFood
};