import { ObjectId } from "mongodb";

export interface employeeEntity {
  _id?: ObjectId,
  userId: ObjectId,
  branchId: ObjectId,
  role: string,
  status: string,
  createdAt: Date,
  updatedAt: Date
}

// làm tiếp API cơ bản của employee 
// Sửa tất cả về _id không để kiểu userId
// hoàn thành JWT

