import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    userId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
      'any.required': "userId is required",
      'string.base': "userId must be a string",
      'string.pattern.base': OBJECT_ID_RULE_MESSAGE
    }),
    employeeId: Joi.string().pattern(OBJECT_ID_RULE).optional().messages({
      'string.base': "employeeId must be a string",
      'string.pattern.base': OBJECT_ID_RULE_MESSAGE
    }),
    branchId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
      'any.required': "branchId is required",
      'string.base': "branchId must be a string",
      'string.pattern.base': OBJECT_ID_RULE_MESSAGE
    }),
    items: Joi.array().items(
      Joi.object({
        itemType: Joi.string().valid("food", "combo").required().messages({
          'any.required': "itemType is required",
          'string.base': "itemType must be a string",
          'any.only': "itemType must be either 'food' or 'combo'"
        }),
        itemId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
          'any.required': "itemId is required",
          'string.base': "itemId must be a string",
          'string.pattern.base': OBJECT_ID_RULE_MESSAGE
        }),
        quantity: Joi.number().min(1).required().messages({
          'any.required': "quantity is required",
          'number.base': "quantity must be a number",
          'number.min': "quantity must be at least 1"
        }),
        price: Joi.number().min(0).required().messages({
          'any.required': "price is required",
          'number.base': "price must be a number",
          'number.min': "price must be at least 0"
        })
      })
    ).required().messages({
      'any.required': "items is required",
      'array.base': "items must be an array"
    }),
    total: Joi.number().min(0).required().messages({
      'any.required': "total is required",
      'number.base': "total must be a number",
    }),
    status: Joi.string().valid("pending", "processing", "completed", "cancelled").messages({
      'string.base': "status must be a string",
      'any.only': "status must be one of 'pending', 'processing', 'completed', or 'cancelled'"
    })
  });

  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
  }
}

export const orderValidation = {
  createNew
}