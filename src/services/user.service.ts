import { createUserRequest } from '../types/user/user.request';
import { createUserResponse } from '../types/user/user.response';
import { userModel } from '../models/user.model';
import argon2 from 'argon2';
import { userEntity } from '~/types/user/user.entity';
import { token } from '~/utils/token';
import ApiError from '~/utils/ApiError';
import { StatusCodes } from 'http-status-codes';

const createNew = async (user: createUserRequest): Promise<createUserResponse> => {
  try {

    const data = {
      ...user,
      password: await argon2.hash(user.password)
    }

    const result = await userModel.createNew(data);

    console.log(result)

    const newUser = await userModel.findOneById(result.insertedId.toString());

    if (!newUser) throw new Error('Create user failed');

    return newUser;

  } catch (error: any) {
    throw error;
  }
}

const getMyInfo = async (authorizationHeader: string): Promise <userEntity> => {
  try {
    const decoded = token.verifyAccessTokenAdmin(authorizationHeader?.split(" ")[1] || "");

    const myInfo = await userModel.findOneById(decoded.sub?.toString().trim() || "");
    if (!myInfo) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

    return myInfo;

  } catch (error) {
    throw error;
  }
}

export const userService = {
  createNew,
  getMyInfo
};