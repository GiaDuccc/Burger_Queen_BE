import { Response } from 'express';
import { ApiResponse } from '~/types/common';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  error?: string
): Response => {
  const response: ApiResponse<T> = {
    success,
    message,
    ...(data && { data }),
    ...(error && { error })
  };

  return res.status(statusCode).json(response);
};

export const sendSuccess = <T>(
  res: Response,
  message: string = 'Success',
  data?: T,
  statusCode: number = 200
): Response => {
  return sendResponse(res, statusCode, true, message, data);
};

export const sendError = (
  res: Response,
  message: string = 'Internal Server Error',
  error?: string,
  statusCode: number = 500
): Response => {
  return sendResponse(res, statusCode, false, message, undefined, error);
};
