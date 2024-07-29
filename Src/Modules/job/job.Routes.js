import express from "express";
import * as NC from "./job.Controllers.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as MV from "../../validation/job.validation.js";
import { systemRoles } from "../../utils/systemRoles.js";
import { multerLocal, validExtension } from "../../../services/multerLocal.js";

//================================================
const router = express.Router();

//================================================
router.post(
  "/add",
  auth([systemRoles.admin]),
  validation(MV.addJobValidation),
  NC.addJob
);
//?================
router.put(
  "/update/:jobId",
  auth([systemRoles.admin]),
  validation(MV.updateJobValidation),
  NC.updateJob
);
//?================

router.delete(
  "/delete/:jobId",
  auth([systemRoles.admin]),
  validation(MV.deleteJobValidation),
  NC.deleteJob
);
//?================

router.get(
  "/all",
  auth([systemRoles.admin, systemRoles.user]),
  validation(MV.getAllJobsValidation),
  NC.getAllJobs
);
//?================

router.get(
  "/company",
  auth([systemRoles.admin, systemRoles.user]),
  validation(MV.getJobsByCompanyValidation),
  NC.getJobsByCompany
);
//?================

router.get(
  "/filter",
  auth([systemRoles.admin, systemRoles.user]),
  validation(MV.filterJobsValidation),
  NC.filterJobs
);
//?================

router.post(
  "/apply",
  multerLocal(validExtension.pdf, "Applications").single("resume"), //for single file
  validation(MV.applyToJobValidation),
  auth([systemRoles.user]),
  NC.applyToJob
);
//================================================
export default router;
