export interface createEmployeeRequest {
  branchId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
  role: string;
  status: string;
  avatarUrl?: string;
}