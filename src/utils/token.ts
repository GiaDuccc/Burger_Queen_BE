import jwt from 'jsonwebtoken';
import { env } from '~/config/environment';

const ACCESS_TOKEN_SECRET = env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_SECRET_ADMIN = env.JWT_ACCESS_SECRET_ADMIN;
const REFRESH_TOKEN_SECRET_ADMIN = env.JWT_REFRESH_SECRET_ADMIN;

const generateAccessToken = (user: { userId: string; role: string }) => {

  return jwt.sign(
    { sub: user.userId, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
}

const generateRefreshToken = (user: { userId: string; role: string }) => {
  return jwt.sign(
    { sub: user.userId, role: user.role },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '24h' }
  );
}

const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}

const generateAccessTokenAdmin = (user: { employeeId: string; role: string }) => {
  return jwt.sign(
    { sub: user.employeeId, role: user.role },
    ACCESS_TOKEN_SECRET_ADMIN,
    { expiresIn: '1m' }
  );
}

const generateRefreshTokenAdmin = (user: { employeeId: string; role: string }) => {
  return jwt.sign(
    { sub: user.employeeId, role: user.role },
    REFRESH_TOKEN_SECRET_ADMIN,
    { expiresIn: '24h' }
  );
}

const verifyAccessTokenAdmin = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET_ADMIN);
}

const verifyRefreshTokenAdmin = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET_ADMIN);
}

export const token = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessTokenAdmin,
  generateRefreshTokenAdmin,
  verifyAccessTokenAdmin,
  verifyRefreshTokenAdmin,
}