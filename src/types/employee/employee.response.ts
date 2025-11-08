import { ObjectId } from "mongodb";

export interface createEmployeeResponse {
  _id?: ObjectId,
  branchId: ObjectId;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  status: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface employeeResponse {
  _id?: ObjectId,
  branchId: ObjectId;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  status: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
}