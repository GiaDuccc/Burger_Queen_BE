import { InsertOneResult, ObjectId } from "mongodb"
import { GET_DB } from "~/config/mongodb"
import { employeeEntity } from "~/types/employee/employee.entity"
import Joi from "joi"
import { OBJECT_ID_RULE } from "~/utils/validators"
import { createEmployeeRequest } from "~/types/employee/employee.request"

const EMPLOYEE_COLLECTION_NAME = 'employees'
const EMPLOYEE_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).required(),
  branchId: Joi.string().pattern(OBJECT_ID_RULE).required(),
  role: Joi.string().valid('manager','admin', 'staff').required(),
  status: Joi.string().valid('working', 'on leave', 'resigned').required(),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date())
})

const validateBeforeCreate = async (employee: createEmployeeRequest): Promise <employeeEntity> => {
  return await EMPLOYEE_COLLECTION_SCHEMA.validateAsync(employee, { abortEarly: false })
}

const createNew = async (employee: createEmployeeRequest): Promise<InsertOneResult> => {
  const validEmployee = await validateBeforeCreate(employee)
  return await GET_DB().collection<employeeEntity>(EMPLOYEE_COLLECTION_NAME).insertOne({
    ...validEmployee,
    userId: new ObjectId(validEmployee.userId),
    branchId: new ObjectId(validEmployee.branchId),
  })
}

const getAllEmployee = async (): Promise <employeeEntity[]> => {
  return await GET_DB().collection <employeeEntity> (EMPLOYEE_COLLECTION_NAME).find({}).toArray() 
}

const findOneById = async (employeeId: string) : Promise<employeeEntity | null> => {
  return await GET_DB().collection <employeeEntity> (EMPLOYEE_COLLECTION_NAME).findOne({_id: new ObjectId(employeeId)})
}

const findEmployeeByUserId = async (userId: string): Promise<employeeEntity | null> => {
  return await GET_DB().collection <employeeEntity> (EMPLOYEE_COLLECTION_NAME).findOne({userId: new ObjectId(userId)})
}


export const employeeModel = {
  getAllEmployee,
  findOneById,
  createNew,
  findEmployeeByUserId
}