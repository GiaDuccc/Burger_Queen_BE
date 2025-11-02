import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { token as tokenUtils } from "~/utils/token";

const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, "Access token is missing"));
  }

  try {
    const decoded = tokenUtils.verifyAccessToken(token);
    if (decoded && typeof decoded === "object") {
      const { sub, role, iat, exp } = decoded;
      if (!sub || !role) {
        return next(new ApiError(StatusCodes.FORBIDDEN, "Invalid access token payload"));
      }
      req.user = { sub: String(sub), role: String(role), iat, exp };
    }
    console.log("validateToken successfully")
    return next();
  } catch (err: any) {
    if (err?.name === "TokenExpiredError") {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Access token has expired"));
    }
    return next(new ApiError(StatusCodes.FORBIDDEN, "Invalid access token"));
  }
};

const authenticateTokenAdmin = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, "Access token is missing"));
  }

  try {
    const decoded = tokenUtils.verifyAccessTokenAdmin(token);
    if (decoded && typeof decoded === "object") {
      const { sub, role, iat, exp } = decoded;
      if (!sub || !role) {
        return next(new ApiError(StatusCodes.FORBIDDEN, "Invalid access token payload"));
      }
      req.user = { sub: String(sub), role: String(role), iat, exp };
    }
    console.log("validateToken successfully")
    return next();
  } catch (err: any) {
    if (err?.name === "TokenExpiredError") {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Access token has expired"));
    }
    return next(new ApiError(StatusCodes.FORBIDDEN, "Invalid access token"));
  }
}

const authorizeRoles = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    // if (!req.user) {
    //   return next(new ApiError(StatusCodes.UNAUTHORIZED, "User/Employee not authenticated"));
    // };

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(StatusCodes.FORBIDDEN, "User does not have permission"));
    };
    console.log("validateRole successfully")
    next();
  }
};

export { authenticateToken, authenticateTokenAdmin, authorizeRoles };

