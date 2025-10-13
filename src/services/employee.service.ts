import { createEmployeeRequest } from "~/types/employee/employee.request"
import { createEmployeeResponse } from "~/types/employee/employee.response"
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { employeeModel } from "~/models/employee.model";
import { userModel } from "~/models/user.model";

const createNew = async (employee: createEmployeeRequest): Promise <createEmployeeResponse> => {
  try {
    const newEmployee = await employeeModel.createNew(employee);
    const result = await employeeModel.findOneById(newEmployee.insertedId.toString());
    if (!result) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot create new employee');
    }

    await userModel.changeUserType (result.userId.toString(), 'employee');

    return result;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error creating new employee');
  }
}

const getEmployeeDetail = async (employeeId: string): Promise<createEmployeeResponse> => {
  try {
    const employee = await employeeModel.findOneById(employeeId);
    if (!employee) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Employee not found');
    }
    return employee;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error fetching employee details');
  }
}

export const employeeService = {
  createNew,
  getEmployeeDetail,
}