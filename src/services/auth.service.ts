import { employeeResponse } from '~/types/employee/employee.response';
import { employeeModel } from '~/models/employee.model';
import { token } from '~/utils/token';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';

const getMyInfoEmployee = async (authorizationHeader: string): Promise <employeeResponse> => {
  try {
    const decoded = token.verifyAccessTokenAdmin(authorizationHeader?.split(" ")[1] || "");

    const myInfo = await employeeModel.findOneById(decoded.sub?.toString().trim() || "");
    if (!myInfo) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

    return myInfo;

  } catch (error) {
    throw error;
  }
}

export const authService = {
  getMyInfoEmployee
}