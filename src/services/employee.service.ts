import { createEmployeeRequest } from "~/types/employee/employee.request"
import { createEmployeeResponse, employeeResponse } from "~/types/employee/employee.response"
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { employeeModel } from "~/models/employee.model";
import argon2 from "argon2";

const createNew = async (employee: createEmployeeRequest): Promise <createEmployeeResponse> => {
  try {
    const data = {
      ...employee,
      password: await argon2.hash(employee.password)
    }

    const newEmployee = await employeeModel.createNew(data);
    const result = await employeeModel.findOneById(newEmployee.insertedId.toString());
    if (!result) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot create new employee');
    }

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