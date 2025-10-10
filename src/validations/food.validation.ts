import { NextFunction, Request, Response } from "express"
import Joi from "joi"
import { StatusCodes } from "http-status-codes"
import ApiError from "~/utils/ApiError"
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators"

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    foodName: Joi.string().min(3).max(256).required().messages({
      'any.required': "foodName is required",
      'string.min': "foodName must be at least 3 characters",
      'string.max': "foodName must be at most 256 characters"
    }),
    foodType: Joi.string().min(3).max(256).valid('burger', 'chicken', 'drink', 'chips').required().messages({
      'any.required': "foodType is required",
      'string.min': "foodType must be at least 3 characters",
      'string.max': "foodType must be at most 256 characters",
      'any.only': "foodType must be one of the following: burger, chicken, drink, chips"
    }),
    favor: Joi.string().min(3).max(256).required().messages({
      'any.required': "favor is required",
      'string.min': "favor must be at least 3 characters",
      'string.max': "favor must be at most 256 characters"
    }),
    price: Joi.number().min(0).required().messages({
      'any.required': "price is required",
      'number.min': "price must be at least 0"
    })
  })
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
  }
}

export const foodValidation = {
  createNew
}