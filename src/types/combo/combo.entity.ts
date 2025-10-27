import { ObjectId } from "mongodb";

export interface comboEntity {
  _id?: ObjectId;
  comboName: string;
  description: string;
  price: number;
  foods: {
    foodId: ObjectId;
    quantity: number;
  }[];
  imageUrl: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
