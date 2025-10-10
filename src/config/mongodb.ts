/* eslint-disable no-console */
import { MongoClient, ServerApiVersion, Db } from 'mongodb';
import { env } from './environment';

// Type definitions
interface MongoConfig {
  serverApi: {
    version: ServerApiVersion;
    strict: boolean;
    deprecationErrors: boolean;
  };
}

// Database instance with proper typing
let shopDatabaseInstance: Db | null = null;

// MongoDB client configuration
const mongoConfig: MongoConfig = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
};

const mongoClientInstance: MongoClient = new MongoClient(env.MONGODB_URI, mongoConfig);

/**
 * Kết nối tới MongoDB Atlas
 * @returns Promise<void>
 */
export const CONNECT_DB = async (): Promise<void> => {
  try {
    // Gọi kết nối tới MongoDB Atlas với URI đã khai báo trong thân của mongoClientInstance
    await mongoClientInstance.connect();

    // Kết nối thành công thì lấy ra Database theo tên và gán ngược nó lại vào biến
    // shopDatabaseInstance ở trên
    shopDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME);
    console.log(`✅ Kết nối thành công tới database: ${env.DATABASE_NAME}`);
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error);
    throw error;
  }
};

/**
 * Đóng kết nối tới database khi cần
 * @returns Promise<void>
 */
export const CLOSE_DB = async (): Promise<void> => {
  try {
    console.log('🔌 Đang đóng kết nối database...');
    await mongoClientInstance.close();
    shopDatabaseInstance = null;
    console.log('✅ Đã đóng kết nối database thành công');
  } catch (error) {
    console.error('❌ Lỗi khi đóng kết nối:', error);
    throw error;
  }
};

/**
 * Lấy instance của database
 * @returns Db instance
 * @throws Error nếu chưa kết nối database
 */
export const GET_DB = (): Db => {
  if (!shopDatabaseInstance) {
    throw new Error('Must connect to Database first!');
  }
  return shopDatabaseInstance;
};