import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import Joi from "joi";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    fullName: Joi.string().min(2).max(100).required().messages({
      'any.required': "fullName is required",
      'string.min': "fullName must be at least 2 characters",
      'string.max': "fullName must be at most 100 characters"
    }),
    email: Joi.string().email().required().messages({
      'any.required': "email is required",
      'string.email': "email must be a valid email"
    }),
    phoneNumber: Joi.string().min(10).max(15).required().messages({
      'any.required': "phoneNumber is required",
      'string.min': "phoneNumber must be at least 10 characters",
      'string.max': "phoneNumber must be at most 15 characters"
    }),
    userType: Joi.string().valid('customer', 'employee'),
    address: Joi.string().min(3).max(256).required().messages({
      'any.required': "address is required",
      'string.min': "address must be at least 3 characters",
      'string.max': "address must be at most 256 characters"
    }),
    password: Joi.string().min(6).required().messages({
      'any.required': "password is required",
      'string.min': "password must be at least 6 characters"
    }),
    avatarUrl: Joi.string().uri().messages({
      'string.uri': "avatarUrl must be a valid URL"
    })
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
  }
};

export const userValidation = {
  createNew
};