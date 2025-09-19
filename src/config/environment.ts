import 'dotenv/config'

interface EnvironmentConfig {
  APP_HOST: string;
  APP_PORT: number;
  // MONGODB_URI: string;
  // DATABASE_NAME: string;
  BUILD_MODE: 'development' | 'production' | 'test';
  AUTHOR: string;
  GEMINI_KEY: string;
  CLOUDINARY_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
}

const getEnvVar = (name: string, defaultValue?: string): string => {
  const value = process.env[name];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value || defaultValue!;
}

const getEnvNumber = (name: string, defaultValue?: number): number => {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  const parsed = parseInt(value || String(defaultValue), 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number`);
  }
  return parsed;
}

export const env: EnvironmentConfig = {
  APP_HOST: getEnvVar('APP_HOST', 'localhost'),
  APP_PORT: getEnvNumber('APP_PORT', 3000),

  // MONGODB_URI: getEnvVar('MONGODB_URI'),
  // DATABASE_NAME: getEnvVar('DATABASE_NAME'),

  BUILD_MODE: getEnvVar('BUILD_MODE', 'development') as 'development' | 'production',

  AUTHOR: getEnvVar('AUTHOR'),
  GEMINI_KEY: getEnvVar('GEMINI_KEY'),

  CLOUDINARY_NAME: getEnvVar('CLOUDINARY_NAME'),
  CLOUDINARY_API_KEY: getEnvVar('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: getEnvVar('CLOUDINARY_API_SECRET'),

  JWT_SECRET: getEnvVar('JWT_SECRET'),
  JWT_REFRESH_SECRET: getEnvVar('JWT_REFRESH_SECRET'),
  DB_HOST: getEnvVar('DB_HOST', 'localhost'),
  DB_PORT: getEnvNumber('DB_PORT', 5432),
  DB_USER: getEnvVar('DB_USER', 'postgres'),
  DB_PASSWORD: getEnvVar('DB_PASSWORD', 'postgres'),
  DB_NAME: getEnvVar('DB_NAME', 'Burger Queen')
}