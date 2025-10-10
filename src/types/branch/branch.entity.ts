import { ObjectId } from "mongodb";

export interface branchEntity {
  _id?: ObjectId;
  companyId: ObjectId;
  branchName: string;
  address: string;
  phoneNumber: string;
  openTime: string;     
  closeTime: string;    
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}