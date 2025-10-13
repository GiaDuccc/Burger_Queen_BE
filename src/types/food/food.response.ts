import { ObjectId } from "mongodb";

export interface createFoodResponse {
  _id?: ObjectId;
  foodName: string;
  foodType: string;
  favor: string;
  price: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}