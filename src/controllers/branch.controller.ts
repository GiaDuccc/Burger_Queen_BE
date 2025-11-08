import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { branchService } from '~/services/branch.service';
import ApiError from '~/utils/ApiError';
import { branchModel } from '~/models/branch.model';

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newBranch = await branchService.createNew(req.body);
    res.status(StatusCodes.CREATED).json(newBranch);
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  };
};

const getAllBranch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const branches = await branchModel.getAllBranch();
    res.status(StatusCodes.OK).json(branches);
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "have error when get all branches"));
  }
};

const getBranchDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const branchId = req.params.id;
    const branch = await branchModel.findOneById(branchId);
    if (!branch) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'branch not found'));
    }
    res.status(StatusCodes.OK).json(branch);
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving branch details'));
  }
};

const getAllCities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cities = await branchModel.getAllCities();
    res.status(StatusCodes.OK).json(cities);
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error retrieving cities"));
  }
};

const getBranchByCity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const city = req.query.city as string;
    const branches = await branchModel.getBranchByCity(city);
    res.status(StatusCodes.OK).json(branches);
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving branches by city'));
  }
};

const getBranchNameById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const branchId = req.params.id;
    const branch = await branchModel.findOneById(branchId);
    if (!branch) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'branch not found'));
    }
    res.status(StatusCodes.OK).json(branch.branchName);
  } catch (error: any) {
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error retrieving branch details'));
  }
};

export const branchController = {
  createNew,
  getAllBranch,
  getBranchDetail,
  getAllCities,
  getBranchByCity,
  getBranchNameById
};