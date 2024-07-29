import Joi from "joi";
import generalFields from "../utils/generalFields.js";

//================================================
//!=========  addJob   =============
export const addJobValidation = {
  body: Joi.object({
    jobTitle: Joi.string().required(),
    jobLocation: Joi.string().required(),
    workingTime: Joi.string().required(),
    seniorityLevel: Joi.string().required(),
    jobDescription: Joi.string().required(),
    technicalSkills: Joi.array().required(),
    softSkills: Joi.array().required(),
    companyId: generalFields.id.required(),
  }),
};
//================================================
//!=========  updateJob   =============
export const updateJobValidation = {
  params: Joi.object({
    jobId: generalFields.id.required(),
  }),
  body: Joi.object({
    jobTitle: Joi.string(),
    jobLocation: Joi.string(),
    workingTime: Joi.string(),
    seniorityLevel: Joi.string(),
    jobDescription: Joi.string(),
    technicalSkills: Joi.array(),
    softSkills: Joi.array(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  deleteJob   =============
export const deleteJobValidation = {
  params: Joi.object({
    jobId: generalFields.id.required(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  getAllJobs   =============
export const getAllJobsValidation = {
  headers: generalFields.headers.required(),
};
//================================================
//!=========  getJobsByCompany   =============
export const getJobsByCompanyValidation = {
  query: Joi.object({
    companyName: Joi.string().required(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  filterJobs   =============
export const filterJobsValidation = {
  query: Joi.object({
    workingTime: Joi.string(),
    jobLocation: Joi.string(),
    seniorityLevel: Joi.string(),
    jobTitle: Joi.string(),
    technicalSkills: Joi.string(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  applyToJob   =============
export const applyToJobValidation = {
  body: Joi.object({
    jobId: generalFields.id.required(),
    userTechSkills: Joi.string().required(),
    userSoftSkills: Joi.string().required(),
  }),
  headers: generalFields.headers.required(),
};
