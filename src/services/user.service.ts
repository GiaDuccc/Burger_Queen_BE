import { createUserRequest } from '../types/user/user.request';
import { createUserResponse } from '../types/user/user.response';
import { userModel } from '../models/user.model';
import argon2 from 'argon2';
import { userEntity } from '~/types/user/user.entity';
import { token } from '~/utils/token';

const createNew = async (user: createUserRequest): Promise<createUserResponse> => {
  try {

    const data = {
      ...user,
      password: await argon2.hash(user.password)
    }

    const result = await userModel.createNew(data);
    const newUser = await userModel.findOneById(result.insertedId.toString());

    if (!newUser) throw new Error('Create user failed');

    return newUser;

  } catch (error: any) {
    throw error;
  }
}

const getMyInfo = async (authorizationHeader: string): Promise <userEntity> => {
  try {
    const decoded = token.verifyAccessToken(authorizationHeader?.split(" ")[1] || "");

    const myInfo = await userModel.findOneById(decoded.sub?.toString() || "");
    if (!myInfo) throw new Error('User not found');

    return myInfo;

  } catch (error) {
    throw error;
  }
}

export const userService = {
  createNew,
  getMyInfo
};