export interface createBranchResponse {
  branchId: string;
  companyId: string;
  branchName: string;
  address: string;
  phoneNumber: string;
  openTime: string;     // timestamp → Date
  closeTime: string;    // timestamp → Date
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}