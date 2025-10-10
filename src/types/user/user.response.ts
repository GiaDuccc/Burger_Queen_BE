export interface createUserResponse {
  userId: string;
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