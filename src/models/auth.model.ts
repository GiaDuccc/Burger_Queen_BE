import { GET_DB } from "~/config/mongodb"
import { userModel } from "./user.model"
import { ObjectId } from "mongodb"

const saveRefreshToken = async (userId: string, refreshToken: string) => {
  await GET_DB().collection(userModel.USER_COLLECTION_NAME).updateOne(
    { _id: new ObjectId(userId) },
    { $set: { 
      refreshToken: refreshToken,
      updatedAt: new Date()
    } }
  )
}

export const authModel = {
  saveRefreshToken
}