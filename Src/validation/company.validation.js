import Joi from "joi";
import generalFields from "../utils/generalFields.js";

//================================================
//!=========  createCompany   =============
export const createCompanyValidation = {
  body: Joi.object({
    companyName: Joi.string().required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.string().required(),
    companyEmail: Joi.string().email().required(),
  }),

  headers: generalFields.headers.required(),
};
//================================================
//!=========  getCompany   =============
export const getCompanyValidation = {
  params: Joi.object({
    companyId: generalFields.id.required(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  updateCompany   =============
export const updateCompanyValidation = {
  params: Joi.object({
    companyId: generalFields.id.required(),
  }),
  body: Joi.object({
    companyName: Joi.string(),
    description: Joi.string(),
    industry: Joi.string(),
    address: Joi.string(),
    numberOfEmployees: Joi.number(),
    companyEmail: Joi.string().email(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  deleteCompany   =============
export const deleteCompanyValidation = {
  params: Joi.object({
    companyId: generalFields.id.required(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  searchCompany   =============
export const searchCompanyValidation = {
  query: Joi.object({
    companyName: Joi.string().required(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
//!=========  getApplications   =============
export const getApplicationsValidation = {
  params: Joi.object({
    jobId: generalFields.id.required(),
  }),
  headers: generalFields.headers.required(),
};
//================================================
