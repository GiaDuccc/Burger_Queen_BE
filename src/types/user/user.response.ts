import { ObjectId } from "mongodb";

export interface createUserResponse {
  _id?: ObjectId;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  userType: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}