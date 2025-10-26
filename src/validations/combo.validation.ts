import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    comboName: Joi.string().min(3).max(256).required().messages({
      'any.required': "comboName is required",
      'string.min': "comboName must be at least 3 characters",
      'string.max': "comboName must be at most 256 characters"
    }),
    description: Joi.string().min(3).required().messages({
      'any.required': "description is required",
      'string.min': "description must be at least 3 characters"
    }),
    price: Joi.number().min(0).required().messages({
      'any.required': "price is required",
      'number.min': "price must be at least 0"
    }),
    foods: Joi.array().items(
      Joi.object({
        foodId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
          'any.required': "foodId is required",
          'string.pattern.base': OBJECT_ID_RULE_MESSAGE
        }),
        quantity: Joi.number().min(1).required().messages({
          'any.required': "quantity is required",
          'number.min': "quantity must be at least 1"
        })
      })
    ),
    imageUrl: Joi.string().uri().required().messages({
      'any.required': "imageUrl is required",
      'string.uri': "imageUrl must be a valid URL"
    })
  })
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
  }
}
export const comboValidation = {
  createNew
}