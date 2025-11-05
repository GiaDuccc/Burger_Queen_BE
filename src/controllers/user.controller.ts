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

const getMyInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const myInfo = await userService.getMyInfo(req.headers.authorization?.toString() || "");
    res.status(StatusCodes.OK).json(myInfo);
  } catch (error) {
    next(error);
  }
}

const getAllUserPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filter = req.query.filter as string;
    const skip = (page - 1) * limit;

    const { users, totalRecords } = await userModel.getAllUserPage(filter, skip, limit);

    return res.status(StatusCodes.OK).json({
      users,
      currentPage: page,
      limit: limit,
      totalPages: Math.ceil(totalRecords / limit)
    });
  } catch (error) {
    next(error);
  }
}

export const userController = {
  createNew,
  getAllUser,
  getUserDetail,
  getMyInfo,
  getAllUserPage
}