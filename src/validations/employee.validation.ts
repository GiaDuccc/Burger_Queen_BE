import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import ApiError from "~/utils/ApiError"
import Joi from "joi"
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators"

const createNew = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    userId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
      'any.required': "userId is required",
      'string.pattern.base': OBJECT_ID_RULE_MESSAGE
    }),
    branchId: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
      'any.required': "branchId is required",
      'string.pattern.base': OBJECT_ID_RULE_MESSAGE
    }),
    role: Joi.string().valid('manager','admin', 'staff').required().messages({
      'any.required': "role is required",
      'any.only': "role must be one of 'manager','admin', 'staff'"
    }),
    status: Joi.string().valid('working', 'on leave', 'resigned').required().messages({
      'any.required': "status is required",
      'any.only': "status must be one of 'working', 'on leave', 'resigned'"
    })
  })
  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
  }
}

export const employeeValidation = {
  createNew
}