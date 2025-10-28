import { ObjectId } from "mongodb";

export interface createBranchResponse {
  _id?: ObjectId;
  companyId: ObjectId;
  branchName: string;
  city: string;
  address: string;
  phoneNumber: string;
  openTime: string;     // timestamp → Date
  closeTime: string;    // timestamp → Date
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}