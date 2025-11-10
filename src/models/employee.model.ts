import { InsertOneResult, ObjectId } from "mongodb"
import { GET_DB } from "~/config/mongodb"
import { employeeEntity } from "~/types/employee/employee.entity"
import Joi from "joi"
import { OBJECT_ID_RULE } from "~/utils/validators"
import { createEmployeeRequest } from "~/types/employee/employee.request"
import { avatarDefault } from '~/utils/avatarDefault';
import ApiError from "~/utils/ApiError"
import { StatusCodes } from "http-status-codes/build/cjs/status-codes"
import argon2 from "argon2"
import { employeeResponse } from "~/types/employee/employee.response"

const EMPLOYEE_COLLECTION_NAME = 'employees'
const EMPLOYEE_COLLECTION_SCHEMA = Joi.object({
  branchId: Joi.string().pattern(OBJECT_ID_RULE).required(),
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(10).max(15).required(),
  password: Joi.string().min(6).required(),
  address: Joi.string().min(3).max(256).required(),
  role: Joi.string().valid('manager', 'admin', 'staff').required(),
  status: Joi.string().valid('working', 'on leave', 'resigned').default('working'),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date()),
  avatarUrl: Joi.string().uri().default(avatarDefault),
})

const validateBeforeCreate = async (employee: createEmployeeRequest): Promise<employeeEntity> => {
  return await EMPLOYEE_COLLECTION_SCHEMA.validateAsync(employee, { abortEarly: false })
}

const createNew = async (employee: createEmployeeRequest): Promise<InsertOneResult> => {
  const validEmployee = await validateBeforeCreate(employee)
  const existedUserEmail = await GET_DB().collection<employeeResponse>(EMPLOYEE_COLLECTION_NAME).findOne({ email: validEmployee.email })
  if (existedUserEmail) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email already exists')
  }

  const existedUserPhone = await GET_DB().collection<employeeResponse>(EMPLOYEE_COLLECTION_NAME).findOne({ phoneNumber: validEmployee.phoneNumber })
  if (existedUserPhone) {
    throw new ApiError(StatusCodes.CONFLICT, 'Phone number already exists')
  }

  try {
    return await GET_DB().collection<employeeEntity>(EMPLOYEE_COLLECTION_NAME).insertOne({
      ...validEmployee,
      branchId: new ObjectId(validEmployee.branchId),
    })
  } catch (error: any) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Create user failed")
  }
}

const signIn = async (username: string, password: string): Promise<employeeResponse | null> => {
  const employee = await GET_DB().collection<employeeEntity>(EMPLOYEE_COLLECTION_NAME).findOne(
    {
      $or: [
        { email: username },
        { phoneNumber: username }
      ]
    }
  )
  if (!employee) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid username')
  }

  if (!(await argon2.verify(employee.password, password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid password')
  }

  return employee;
};

const getAllEmployee = async (): Promise<employeeResponse[]> => {
  return await GET_DB().collection<employeeResponse>(EMPLOYEE_COLLECTION_NAME).find({}).toArray()
}

const findOneById = async (employeeId: string): Promise<employeeResponse | null> => {
  return await GET_DB().collection<employeeResponse>(EMPLOYEE_COLLECTION_NAME).findOne(
    { _id: new ObjectId(employeeId) },
    { projection: { password: 0, refreshTokenAdmin: 0 } }
  )
}

const getAllEmployeePage = async (filter: string, skip: number, limit: number, branchId: string): Promise<{
  employees: employeeResponse[],
  totalRecords: number
}> => {

  const query: any = { status: "working" }
  if (branchId) {
    query.branchId = new ObjectId(branchId);
  }

  let sortOrder: any = {};
  if (filter === "newest") {
    sortOrder = { createdAt: -1 };
  } else if (filter === "oldest") {
    sortOrder = { createdAt: 1 };
  } else if (filter === "a-z") {
    sortOrder = { fullName: 1 };
  } else if (filter === "z-a") {
    sortOrder = { fullName: -1 };
  }

  const employees = await GET_DB().collection<employeeResponse>(EMPLOYEE_COLLECTION_NAME).find(query)
    .sort(sortOrder) // Sắp xếp theo thứ tự đã chỉ định
    .skip(skip)
    .limit(limit)
    .project({ password: 0, refreshTokenAdmin: 0 }) // Loại bỏ trường password
    .toArray() as employeeResponse[];

  const totalRecords = await GET_DB().collection<employeeResponse>(EMPLOYEE_COLLECTION_NAME).countDocuments({ status: true });
  return { employees, totalRecords };
}

const getRefreshToken = async (employeeId: string): Promise<string | null> => {
  return await GET_DB().collection<employeeEntity>(EMPLOYEE_COLLECTION_NAME).findOne(
    { _id: new ObjectId(employeeId) }
  ).then(result => result?.refreshTokenAdmin || null);
}

export const employeeModel = {
  EMPLOYEE_COLLECTION_NAME,
  getAllEmployee,
  findOneById,
  createNew,
  getAllEmployeePage,
  signIn,
  getRefreshToken
}