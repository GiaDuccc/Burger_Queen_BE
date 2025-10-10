import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { companyModel } from '~/models/company.model';

const getDetail = async (req: Request, res: Response) => {
  try {
    const companyDetails = await companyModel.getDetail();
    res.status(StatusCodes.OK).json({
      success: true,
      data: companyDetails,
      message: 'Company details retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const companyController = {
  getDetail
};