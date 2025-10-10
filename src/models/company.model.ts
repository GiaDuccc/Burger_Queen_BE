import { GET_DB } from '~/config/mongodb';
import { companyDetail } from '~/types/company.interface';
import ApiError from '~/utils/ApiError';

const COMPANY_COLLECTION_NAME = 'company';

const getDetail = async (): Promise<companyDetail> => {
  try {
    const result = await GET_DB()
      .collection<companyDetail>(COMPANY_COLLECTION_NAME)
      .findOne({}); // Nên có filter rõ ràng

    if (!result) {
      throw new ApiError(404, 'Company details not found');
    }

    return result;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, 'Internal Server Error', error);
  }
};

export const companyModel = {
  getDetail
};
