import { ObjectId } from "mongodb"; 

export interface orderResponse {
  _id: ObjectId;
  userId: ObjectId;
  employeeId?: ObjectId;
  branchId: ObjectId;
  items: {
    itemType: "food" | "combo";
    itemId: ObjectId;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}