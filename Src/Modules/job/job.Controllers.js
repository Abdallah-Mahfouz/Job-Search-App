import { asyncHandler } from "../../middleware/asyncHandler.js";
import jobModel from "../../../Models/job.Models.js";
import companyModel from "../../../Models/company.Models.js";
import { AppError } from "../../utils/appError.js";
import applicationModel from "../../../Models/application.Models.js";

//================================================1
//!=========  addJob   =============
export const addJob = asyncHandler(async (req, res) => {
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    companyId,
  } = req.body;

  const addedBy = req.user._id;

  const newJob = await jobModel.create({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy,
    companyId,
  });

  res.status(201).json({ msg: "Job created successfully", job: newJob });
});
//================================================2
//!=========  updateJob   =============
export const updateJob = asyncHandler(async (req, res, next) => {
  const jobId = req.params.jobId;
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;

  const updatedJob = await jobModel.findByIdAndUpdate(
    jobId,
    {
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
    },
    { new: true }
  );

  if (!updatedJob) {
    return next(new AppError("Failed to update job", 400));
  }

  res.status(200).json({ msg: "Job updated successfully", job: updatedJob });
});
//================================================3
//!=========  deleteJob   =============
export const deleteJob = asyncHandler(async (req, res, next) => {
  const jobId = req.params.jobId;

  const job = await jobModel.findById(jobId);
  if (!job) {
    return next(new AppError("Job not found", 404));
  }
  // Delete related applications
  await applicationModel.deleteMany({ jobId: job._id });

  // Delete the job
  await jobModel.findByIdAndDelete(jobId);

  res.status(200).json({ msg: "Job deleted successfully" });
});
//================================================4
//!=========  getAllJobs   =============
export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await jobModel.find().populate("addedBy");
  res.status(200).json({ msg: "Jobs retrieved successfully", jobs });
});
//================================================5
//!=========  getJobsByCompany   =============
export const getJobsByCompany = asyncHandler(async (req, res) => {
  const companyName = req.query.companyName;
  const company = await companyModel.findOne({ companyName });

  if (!company) {
    return next(new AppError("Company not found", 404));
  }

  // Find jobs related to the company
  const jobs = await jobModel.find({ addedBy: company.companyHR });

  if (!jobs || jobs.length === 0) {
    return next(new AppError("No jobs found for this company", 404));
  }
  res.status(200).json({ msg: "Jobs retrieved successfully", jobs });
});
//================================================6
//!=========  filterJobs   =============
export const filterJobs = asyncHandler(async (req, res) => {
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.query;
  const filters = {};

  if (workingTime) filters.workingTime = workingTime;
  if (jobLocation) filters.jobLocation = jobLocation;
  if (seniorityLevel) filters.seniorityLevel = seniorityLevel;
  if (jobTitle) filters.jobTitle = new RegExp(jobTitle, "i");
  if (technicalSkills)
    filters.technicalSkills = { $in: technicalSkills.split(",") };

  const jobs = await jobModel.find(filters);
  res.status(200).json({ msg: "Jobs retrieved successfully", jobs });
});
//================================================7
//!=========  applyToJob   =============
export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId, userTechSkills, userSoftSkills } = req.body;
  const userId = req.user._id;

  // for single file👇👇
  if (!req.file) {
    return next(new AppError("Resume  not found", 400));
  }
  // Check if jobId exists
  const job = await jobModel.findById(jobId);
  if (!job) {
    return next(new AppError("Job not found", 404));
  }

  // Create a new application
  const newApplication = await applicationModel.create({
    jobId,
    userId,
    userTechSkills: userTechSkills.split(","),
    userSoftSkills: userSoftSkills.split(","),
    userResume: req.file.path,
  });

  res.status(201).json({
    msg: "Application submitted successfully",
    application: newApplication,
  });
});
