import { GET_DB } from "~/config/mongodb"
import { userModel } from "./user.model"
import { employeeModel } from "./employee.model"
import { ObjectId } from "mongodb"

const saveRefreshToken = async (userId: string, refreshToken: string) => {
  await GET_DB().collection(userModel.USER_COLLECTION_NAME).updateOne(
    { _id: new ObjectId(userId) },
    { $set: { 
      refreshToken: refreshToken,
      updatedAt: new Date()
    } }
  )
}

const saveRefreshTokenAdmin = async (employeeId: string, refreshToken: string) => {
  await GET_DB().collection(employeeModel.EMPLOYEE_COLLECTION_NAME).updateOne(
    { _id: new ObjectId(employeeId) },
    { $set: { 
      refreshTokenAdmin: refreshToken,
      updatedAt: new Date()
    } }
  )
}

const clearRefreshToken = async (userId: string) => {
  await GET_DB().collection(userModel.USER_COLLECTION_NAME).updateOne(
    { _id: new ObjectId(userId) },
    { $set: { 
      refreshToken: null,
      updatedAt: new Date()
    } }
  )
}

const clearRefreshTokenAdmin = async (employeeId: string) => {
  await GET_DB().collection(employeeModel.EMPLOYEE_COLLECTION_NAME).updateOne(
    { _id: new ObjectId(employeeId) },
    { $set: { 
      refreshTokenAdmin: null,
      updatedAt: new Date()
    } }
  )
}

export const authModel = {
  saveRefreshToken,
  clearRefreshToken,
  saveRefreshTokenAdmin,
  clearRefreshTokenAdmin
}