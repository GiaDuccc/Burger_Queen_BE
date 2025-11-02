import { ObjectId } from 'mongodb';

export interface userEntity {
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
  refreshToken?: string;
  refreshTokenAdmin?: string;
}