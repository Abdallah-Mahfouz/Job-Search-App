import Joi from "joi";
import generalFields from "../utils/generalFields.js";
//================================================
//!=========  signUp   =============
export const signUpValidation = {
  body: Joi.object({
    firstName: Joi.string().alphanum().min(3).max(30),
    lastName: Joi.string().alphanum().min(3).max(30),
    username: Joi.string().alphanum().min(3).max(30),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    recoveryEmail: Joi.string().email().required(),
    DOB: Joi.date().iso().required(),
    mobileNumber: Joi.string()
      .regex(/^01[0-2]\d{1,8}$/)
      .required(),
    role: Joi.string().valid("User", "Company_HR"),
  }),
};

//================================================
//!=========  signIn   =============
export const signInValidation = {
  body: Joi.object({
    email: generalFields.email.optional(),
    password: generalFields.password.required(),
    recoveryEmail: Joi.string().email().optional(),
    mobileNumber: Joi.string()
      .regex(/^01[0-2]\d{1,8}$/)
      .optional(),
  }),
};
//================================================
//!=========  updateUser   =============
export const updateUserValidation = {
  body: Joi.object({
    firstName: Joi.string().alphanum().min(3).max(30),
    lastName: Joi.string().alphanum().min(3).max(30),
    email: generalFields.email.optional(),
    recoveryEmail: Joi.string().email().optional(),
    DOB: Joi.date().optional(),
    mobileNumber: Joi.string()
      .regex(/^01[0-2]\d{1,8}$/)
      .optional(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  deleteUser   =============
export const deleteUserValidation = {
  headers: generalFields.headers.required(),
};
//================================================
//!=========  getUser   =============
export const getUserValidation = {
  headers: generalFields.headers.required(),
};
//================================================
//!=========  getAnotherUser   =============
export const getAnotherUserValidation = {
  params: Joi.object({
    userId: generalFields.id.required(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  updatePassword   =============
export const updateUserPasswordValidation = {
  body: Joi.object({
    currentPassword: generalFields.password.required(),
    newPassword: generalFields.password.required(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  forgotPassword   =============
export const forgotPasswordValidation = {
  body: Joi.object({
    email: generalFields.email.required(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  resetPassword   =============
export const resetPasswordValidation = {
  body: Joi.object({
    email: generalFields.email.required(),
    otp: Joi.string().required(),
    password: generalFields.password.required(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  getAccounts   =============
export const getAccountsValidation = {
  params: Joi.object({
    recoveryEmail: Joi.string().email().required(),
  }),
};
