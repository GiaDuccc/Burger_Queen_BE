import { ObjectId } from "mongodb";

export interface createEmployeeResponse {
  _id?: ObjectId,
  userId: ObjectId,
  branchId: ObjectId,
  role: string,
  status: string,
  createdAt: Date,
  updatedAt: Date
}