import { ObjectId } from 'mongodb'

export interface foodEntity {
  _id?: ObjectId;
  foodName: string;
  normalizedName: string;
  foodType: string;
  description: string;
  favor: string;
  price: number;
  imageUrl: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
} 