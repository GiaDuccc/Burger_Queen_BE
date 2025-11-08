import { ObjectId } from "mongodb";

export interface employeeEntity {
  _id?: ObjectId,
  branchId: ObjectId;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  role: string;
  status: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
  refreshTokenAdmin?: string;
}

