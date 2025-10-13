import { createUserRequest } from '../types/user/user.request';
import { createUserResponse } from '../types/user/user.response';
import { userModel } from '../models/user.model';
import argon2 from 'argon2';

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


export const userService = {
  createNew
};