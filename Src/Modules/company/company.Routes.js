import express from "express";
import * as NC from "./company.Controllers.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as MV from "../../validation/company.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";
import { isCompanyOwner } from "../../middleware/companyOwner.js";
//================================================
const router = express.Router();
//================================================
//?================
router.post(
  "/",
  auth([systemRoles.admin]),
  validation(MV.createCompanyValidation),
  NC.addCompany
);
//?================
router.put(
  "/:companyId",
  auth([systemRoles.admin]),
  isCompanyOwner,
  validation(MV.updateCompanyValidation),
  NC.updateCompany
);
//?================
router.delete(
  "/:companyId",
  auth([systemRoles.admin]),
  isCompanyOwner,
  validation(MV.deleteCompanyValidation),
  NC.deleteCompany
);
//?================
router.get(
  "/getCompany/:companyId",
  auth([systemRoles.admin]),
  validation(MV.getCompanyValidation),
  NC.getCompany
);
//?================
router.get(
  "/search",
  auth([systemRoles.admin, systemRoles.user]),
  validation(MV.searchCompanyValidation),
  NC.searchCompany
);
//?================
router.get(
  "/applications/:jobId",
  auth([systemRoles.admin]),
  validation(MV.getApplicationsValidation),
  NC.getApplications
);
//================================================
export default router;
