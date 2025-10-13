import jwt from 'jsonwebtoken';
import { env } from '~/config/environment';

const ACCESS_TOKEN_SECRET = env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = env.JWT_REFRESH_SECRET;

const generateAccessToken = (user: { id: string; role: string }) => {

  return jwt.sign(
    { userId: user.id, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
}

const generateRefreshToken = (user: { id: string; role: string }) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
}

const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}

export const token = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
}