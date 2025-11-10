import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { token } from '~/utils/token';
import { employeeModel } from '~/models/employee.model';
import { authModel } from '~/models/auth.model';
import ApiError from '~/utils/ApiError';
import { authService } from '~/services/auth.service';

// const signIn = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { username, password } = req.body;
//     const user = await userModel.signIn(username, password);

//     const accessToken = token.generateAccessToken({ userId: user._id?.toString() || "", role: user.userType });

//     const refreshToken = token.generateRefreshToken({ userId: user._id?.toString() || "", role: user.userType });

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: false, // true nếu có HTTPS
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000 // 24 hours
//     });

//     await authModel.saveRefreshToken(user._id?.toString() || "", refreshToken);

//     // Generate JWT token
//     res.status(StatusCodes.OK).json({
//       introduce: `Welcome back ${user.fullName}!`,
//       message: 'Sign in success',
//       accessToken
//     });

//   } catch (error: any) {
//     next(error);
//   }
// }

// const signUp = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const newUser = await userService.createNew(req.body);
//     res.status(StatusCodes.CREATED).json({
//       introduce: `Welcome ${newUser.fullName}!`,
//       status: 'success',
//       message: `You have successfully registered account ${newUser.email}`
//     });
//   } catch (error: any) {
//     next(error);
//   }
// }

// const signOut = async (req: any, res: Response, next: NextFunction) => {
//   try {
//     console.log(req.user);
//     await authModel.clearRefreshToken(req.user?.sub || "");
//     res.status(StatusCodes.OK).json({ message: "Sign out successful" });
//   } catch (error) {
//     next(error);
//   }
// }

// const refresh = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const refreshToken = req.cookies.refreshToken; // lấy từ cookie

//     if (!refreshToken) return res.status(401).json({ message: "No token" });

//     // Verify token
//     const decoded = token.verifyRefreshToken(refreshToken) as JwtPayload;

//     if (!decoded || typeof decoded !== 'object' || !decoded.sub) {
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     const payload = decoded as JwtPayload & { role?: string };

//     const user = await userModel.findOneById(String(payload.sub));

//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Token stored in DB must match
//     if (user.refreshToken !== refreshToken) {
//       return res.status(403).json({ message: "Invalid token" });
//     }

//     // Generate new tokens
//     const newAccessToken = token.generateAccessToken({ userId: user._id?.toString() || "", role: payload.role || "" });

//     const newRefreshToken = token.generateRefreshToken({ userId: user._id?.toString() || "", role: payload.role || "" });

//     // Save new refresh token (rotate)
//     await authModel.saveRefreshToken(user._id?.toString() || "", newRefreshToken);

//     // Set new refresh token in cookie
//     res.cookie("refreshToken", newRefreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(StatusCodes.OK).json({
//       introduce: `Welcome ${user.fullName}!`,
//       message: 'Sign in success',
//       accessToken: newAccessToken
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// }

const signInAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const employee = await employeeModel.signIn(username, password);

    if (!employee) { throw new ApiError(StatusCodes.FORBIDDEN, "Employee not found"); }

    const accessToken = token.generateAccessTokenAdmin({ employeeId: employee?._id?.toString() || "", branchId: employee?.branchId.toString() || "", role: employee?.role || "" });

    const refreshToken = token.generateRefreshTokenAdmin({ employeeId: employee?._id?.toString() || "", branchId: employee?.branchId.toString() || "", role: employee?.role || "" });

    res.cookie("refreshTokenAdmin", refreshToken, {
      httpOnly: true,
      secure: false, // true nếu có HTTPS
      sameSite: "strict",
      maxAge: 6 * 60 * 60 * 1000 // 6 hours
    });

    await authModel.saveRefreshTokenAdmin(employee._id?.toString() || "", refreshToken);

    // Generate JWT token
    res.status(StatusCodes.OK).json({
      introduce: `Welcome admin ${employee.fullName}!`,
      message: 'Sign in success',
      accessToken,
      employee: employee
    });

  } catch (error: any) {
    next(error);
  }
}

const refreshAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshTokenAdmin; // lấy từ cookie

    if (!refreshToken) throw new ApiError(StatusCodes.UNAUTHORIZED, "No token");

    // Verify token
    const decoded = token.verifyRefreshTokenAdmin(refreshToken) as JwtPayload;

    if (!decoded || typeof decoded !== 'object' || !decoded.sub) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
    }

    const payload = decoded as JwtPayload & { role?: string };

    const employee = await employeeModel.findOneById(String(payload.sub));

    if (!employee) throw new ApiError(StatusCodes.NOT_FOUND, "employee not found");

    const employeeRefreshToken = await employeeModel.getRefreshToken(employee._id?.toString() || "");

    // Token stored in DB must match
    if (employeeRefreshToken !== refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
    }

    // Generate new tokens
    const newAccessToken = token.generateAccessTokenAdmin({ employeeId: employee._id?.toString() || "", branchId: employee.branchId.toString() || "", role: payload.role || "" });

    const newRefreshToken = token.generateRefreshTokenAdmin({ employeeId: employee._id?.toString() || "", branchId: employee.branchId.toString() || "", role: payload.role || "" });

    // Save new refresh token (rotate)
    await authModel.saveRefreshTokenAdmin(employee._id?.toString() || "", newRefreshToken);

    // Set new refresh token in cookie
    res.cookie("refreshTokenAdmin", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 6 * 60 * 60 * 1000,
    });

    res.status(StatusCodes.OK).json({
      introduce: `Welcome ${employee.fullName}!`,
      message: 'Sign in success',
      accessToken: newAccessToken
    });

  } catch (err) {
    console.error(err);
    next(err);
  }
}

const getMyInfoEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const myInfo = await authService.getMyInfoEmployee(req.headers.authorization?.toString() || "");
    res.status(StatusCodes.OK).json(myInfo);
  } catch (error) {
    next(error);
  }
}

const signOutAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshTokenAdmin;

    // Không có token => không cần xử lý
    if (!refreshToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "No refresh token provided" });
    }

    // Giải mã token để lấy employeeId (sub)
    const decoded = token.verifyRefreshTokenAdmin(refreshToken) as JwtPayload;

    // Xóa cookie refreshTokenAdmin
    res.clearCookie("refreshTokenAdmin");

    // Nếu có sub thì gọi model clear refresh token
    if (decoded?.sub) {
      await authModel.clearRefreshTokenAdmin(decoded.sub);
    }

    return res.status(StatusCodes.OK).json({ message: "Sign out successful" });

  } catch (error) {
    next(error);
  }
};

export const authController = {
  // signIn,
  // signUp,
  // signOut,
  // refresh,
  refreshAdmin,
  signInAdmin,
  getMyInfoEmployee,
  signOutAdmin
}