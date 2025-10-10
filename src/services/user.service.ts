import { createUserRequest } from '../types/user/user.request';
import { createUserResponse } from '../types/user/user.response';
import { userModel } from '../models/user.model';

const createNew = async (user: createUserRequest):Promise<createUserResponse> => {
  try {
    const result = await userModel.createNew(user);
    const newUser = await userModel.findOneById(result.insertedId.toString());
    
    if (!newUser) throw new Error('Create user failed');

    const { _id, ...rest } = newUser;

    return {
      userId: _id?.toString() || '',
      ...rest
    };

  } catch (error: any) {
    throw new Error(error.message);
  }
}


export const userService = {
  createNew
};