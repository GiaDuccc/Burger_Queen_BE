import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { userService } from "~/services/user.service";
import { userModel } from "~/models/user.model";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await userService.createNew(req.body);
    res.status(StatusCodes.CREATED).json(newUser);
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
}

const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.getAllUser();
    res.status(StatusCodes.OK).json(users);
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
}

const getUserDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userModel.findOneById(req.params.id);
    if (!user) {
      return next(new ApiError(StatusCodes.NOT_FOUND, "User not found"));
    }
    res.status(StatusCodes.OK).json(user);
  } catch (error: any) {
    next(error);
  }
}

export const userController = {
  createNew,
  getAllUser,
  getUserDetail
}