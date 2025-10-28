import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { Request, Response, NextFunction } from 'express';

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    companyId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
      'any.required': "companyId is required",
      'string.pattern.base': OBJECT_ID_RULE_MESSAGE
    }),
    branchName: Joi.string().min(3).max(256).required().messages({
      'any.required': "branchName is required",
      'string.min': "branchName must be at least 3 characters",
      'string.max': "branchName must be at most 256 characters"
    }),
    city: Joi.string().min(2).max(100).required().messages({
      'any.required': "city is required",
      'string.min': "city must be at least 2 characters",
      'string.max': "city must be at most 100 characters"
    }),
    address: Joi.string().min(3).required().messages({
      'any.required': "address is required",
      'string.min': "address must be at least 3 characters",
    }),
    phoneNumber: Joi.string().min(10).max(15).pattern(/^\+?[0-9]{10,15}$/).required().messages({
      'string.pattern.base': 'phoneNumber must be a valid phone number',
      'any.required': 'phoneNumber is required'
    }),
    openTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
      'string.pattern.base': 'openTime must be HH:mm',
      'any.required': 'openTime is required'
    }),
    closeTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
      'string.pattern.base': 'closeTime must be HH:mm',
      'any.required': 'closeTime is required'
    }),
  });
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    const errorMessage = new Error(error).message

    const customError = new ApiError(StatusCodes.BAD_REQUEST, errorMessage)
    next(customError)
  }
};

export const branchValidation = {
  createNew,
};
