import { createBranchResponse } from "~/types/branch/branch.response";
import { createBranchRequest } from "~/types/branch/branch.request";
import { branchModel } from "~/models/branch.model";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";

const createNew = async (payload: createBranchRequest): Promise<createBranchResponse> => {
  try {
    const result = await branchModel.createNew(payload);
    const newBranch = await branchModel.findOneById(result.insertedId.toString());

    if (!newBranch) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Create branch failed');

    return newBranch;

  } catch (error: any) { throw new Error(error.message) };
};

export const branchService = {
  createNew
};