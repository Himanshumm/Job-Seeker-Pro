import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  console.log("Checking authentication...");

  const { token } = req.cookies;
  console.log("Token received:", token);

  if (!token) {
    console.log("No token found. Unauthorized.");
    return next(new ErrorHandler("User Not Authorized", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token:", decoded);

    req.user = await User.findById(decoded.id);
    if (!req.user) {
      console.log("User not found in database.");
      return next(new ErrorHandler("User Not Found", 404));
    }

    console.log("User authenticated successfully:", req.user._id);
    next();
  } catch (error) {
    console.log("Error verifying token:", error.message);
    return next(new ErrorHandler("Invalid or Expired Token", 401));
  }
});