import userModel from "../../../Models/user.Models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../services/sendEmail.js";
import { AppError } from "../../utils/appError.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import jobModel from "../../../Models/job.Models.js";
import applicationModel from "../../../Models/application.Models.js";
import companyModel from "../../../Models/company.Models.js";
//================================================
//!=========  signUp   =============
export const signUp = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
  } = req.body;
  //==================
  // Check if user already exists
  const existingUser = await userModel.findOne({
    $or: [{ email }, { mobileNumber }],
  });
  if (existingUser) {
    return next(new AppError("user is already exist", 400));
  }
  //==================
  const hash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
  const user = await userModel.create({
    firstName,
    lastName,
    username,
    email,
    password: hash,
    recoveryEmail,
    DOB: new Date(DOB).toISOString().slice(0, 10),
    mobileNumber,
    role,
  });
  user
    ? res.status(201).json({ msg: "success", user })
    : next(new AppError("failed to create user", 400));
});

//================================================
//!=========  signIn   =============
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password, recoveryEmail, mobileNumber } = req.body;
  // Find the user
  const user = await userModel.findOne({
    $or: [{ email }, { recoveryEmail }, { mobileNumber }],
  });
  //================
  // Check if the user exists and compere the password
  if (!user || !bcrypt.compareSync(password, user.password)) {
    next(
      new AppError(
        "email not exist or not confirmed or password incorrect",
        404
      )
    );
  }
  //================
  // Update the user status to online
  await userModel.findByIdAndUpdate(user.id, { status: "online" });
  //================
  // Generate a JWT token
  const token = jwt.sign({ userId: user.id }, process.env.SIGNATURE_KEY, {
    expiresIn: "1h",
  });
  //================
  token
    ? res.status(201).json({ msg: "success", token })
    : next(new AppError("Error signing in", 400));
});
//================================================
//!=========  updateUser   =============
export const updateUser = asyncHandler(async (req, res, next) => {
  const { email, mobileNumber, recoveryEmail, dob, lastName, firstName } =
    req.body;
  const userId = req.user._id;
  //================
  // Check if the new email or mobileNumber is unique
  const existingUser = await userModel.findOne({
    $and: [{ _id: { $ne: userId } }, { $or: [{ email }, { mobileNumber }] }],
  });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Email or mobile number already exists" });
  }
  //================
  // Update the user
  const user = await userModel.findOneAndUpdate(
    userId,
    { email, mobileNumber, recoveryEmail, dob, lastName, firstName },
    { new: true }
  );
  //================
  user
    ? res.status(200).json({ msg: "updatedUser", user })
    : next(new AppError("failed to update user", 400));
});
//================================================
//!=========  deleteUser   =============
export const deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // If the user is a Company_HR, delete related companies and jobs
  const companies = await companyModel.find({ companyHR: user._id });
  for (const company of companies) {
    // Delete related jobs for each company
    const jobs = await jobModel.find({ companyId: company._id });
    for (const job of jobs) {
      // Delete related applications for each job
      await applicationModel.deleteMany({ jobId: job._id });
    }
    await jobModel.deleteMany({ companyId: company._id });

    // Delete the company
    await companyModel.findByIdAndDelete(company._id);
  }

  // Delete related jobs added by the user
  const userJobs = await jobModel.find({ addedBy: user._id });
  for (const job of userJobs) {
    // Delete related applications for each job
    await applicationModel.deleteMany({ jobId: job._id });
  }
  await jobModel.deleteMany({ addedBy: user._id });

  // Delete related applications by the user
  await applicationModel.deleteMany({ userId: user._id });

  // Delete the user
  const deleteUser = await userModel.findByIdAndDelete(userId);

  res.status(200).json({ msg: "User deleted successfully", deleteUser });
});
//================================================
//!=========  getUser   =============
export const getUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  // Find the user
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({ msg: "'done", user });
});
//================================================
//!=========  getAnotherUser   =============
export const getAnotherUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  // Find the user
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({ msg: "'done", user });
});
//================================================
//!=========  updatePassword   =============
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;
  //================
  // Find the user
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  //================
  // Check if the current password is correct
  if (!bcrypt.compareSync(currentPassword, user.password)) {
    return next(new AppError("current password is incorrect", 400));
  }
  //================
  // Update the password
  const hashedPassword = bcrypt.hashSync(
    newPassword,
    Number(process.env.SALT_ROUNDS)
  );
  // Update the password
  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { new: true } // Return the updated user
  );
  updatedUser
    ? res
        .status(200)
        .json({ msg: "password updated successfully", updatedUser })
    : next(new AppError("failed to update password", 400));
});
//================================================
//!=========  forgetPassword   =============
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  //================
  // Find the user
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  //================
  // Send the password reset link to the user's email
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
  const otpHtml = `<p>Your OTP code is <b>${otp}</b>. It will expire in 10 minutes.</p>`;
  // ==================
  const checkSendEmail = await sendEmail(email, "OTP Confirmation", otpHtml);
  if (!checkSendEmail) {
    next(new AppError("failed to send OTP email", 400));
  }
  await userModel.findByIdAndUpdate(user._id, { otp, otpExpires });

  res.status(200).json({ msg: "OTP sent to your email successfully" });
});
//================================================
//!=========  resetPassword   =============
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  //================
  const user = await userModel.findOne({ email });
  //================
  if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
    return next(new AppError("Invalid OTP or email", 400));
  }
  //================
  user.password = await bcrypt.hash(
    newPassword,
    Number(process.env.SALT_ROUNDS)
  );
  user.otp = null; // Clear the OTP
  user.otpExpires = null; // Clear the OTP expiration time
  await user.save();

  //================
  res.json({ msg: "Password reset successfully" });
});
//================================================
//! Get all accounts associated to a specific recovery Email
export const getAccounts = asyncHandler(async (req, res, next) => {
  const users = await userModel.find({
    recoveryEmail: req.params.recoveryEmail,
  });
  if (users.length === 0) return next(new AppError("No accounts found", 404));

  res.json({ msg: "done", users });
});
