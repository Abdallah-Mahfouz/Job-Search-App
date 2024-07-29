import express from "express";
import * as UC from "../user/user.controllers.js";
import * as UV from "../../validation/user.validation.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { systemRoles } from "../../utils/systemRoles.js";
//================================================

const router = express.Router();

//================================================
router.post("/signUp", validation(UV.signUpValidation), UC.signUp);
//?==============
router.post("/signIn", validation(UV.signInValidation), UC.signIn);
//?==============
router.get(
  "/",
  auth([systemRoles.admin, systemRoles.user]),
  validation(UV.getUserValidation),
  UC.getUser
);
//?==============
router.get(
  "/profile/:userId",
  auth([systemRoles.admin, systemRoles.user]),
  validation(UV.getAnotherUserValidation),
  UC.getAnotherUser
);
//?==============
router.put(
  "/",
  auth([systemRoles.admin, systemRoles.user]),
  validation(UV.updateUserValidation),
  UC.updateUser
);
//?==============
router.delete(
  "/",
  auth([systemRoles.admin, systemRoles.user]),
  validation(UV.deleteUserValidation),
  UC.deleteUser
);
//?==============
router.put(
  "/updatePassword",
  auth([systemRoles.admin, systemRoles.user]),
  validation(UV.updateUserPasswordValidation),
  UC.updatePassword
);
//?==============
router.post(
  "/forgotPassword",
  auth([systemRoles.admin, systemRoles.user]),
  validation(UV.forgotPasswordValidation),
  UC.forgetPassword
);
//?==============
router.post(
  "/resetPassword",
  auth([systemRoles.admin, systemRoles.user]),
  validation(UV.resetPasswordValidation),
  UC.resetPassword
);
//?==============
router.get(
  "/recovery-email/:recoveryEmail",
  validation(UV.getAccountsValidation),
  UC.getAccounts
);

//================================================
export default router;
