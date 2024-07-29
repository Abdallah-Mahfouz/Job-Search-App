import { asyncHandler } from "../../middleware/asyncHandler.js";
import companyModel from "../../../Models/company.Models.js";
import { AppError } from "../../utils/appError.js";
import userModel from "../../../Models/user.Models.js";
import jobModel from "../../../Models/job.Models.js";
import applicationModel from "../../../Models/application.Models.js";
//================================================
//!=========  addCompany   =============1
export const addCompany = asyncHandler(async (req, res) => {
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;

  const companyHR = req.user._id;

  try {
    const newCompany = await companyModel.create({
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      companyHR,
    });

    res.status(201).json({
      msg: "Company created successfully",
      company: newCompany,
    });
  } catch (error) {
    next(new AppError("Failed to create company", 400));
  }
});
//================================================
//!=========  updateCompany   =============2
export const updateCompany = asyncHandler(async (req, res, next) => {
  const companyId = req.params.companyId;
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;

  const updatedCompany = await companyModel.findByIdAndUpdate(
    companyId,
    {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
    },
    { new: true }
  );

  if (!updatedCompany) {
    return next(new AppError("Failed to update company", 400));
  }

  res
    .status(200)
    .json({ msg: "Company updated successfully", company: updatedCompany });
});

//================================================3
//!=========  deleteCompany   =============
export const deleteCompany = asyncHandler(async (req, res, next) => {
  const companyId = req.params.companyId;
  const company = await companyModel.findById(companyId);

  if (!company) {
    return next(new AppError("Company not found", 404));
  }

  // Find jobs related to the company
  const jobs = await jobModel.find({ companyId: company._id });

  // Delete related applications
  for (const job of jobs) {
    await applicationModel.deleteMany({ jobId: job._id });
  }

  // Delete related jobs
  await jobModel.deleteMany({ companyId: company._id });

  // Delete the company
  const deletedCompany = await companyModel.findByIdAndDelete(companyId);
  res.status(200).json({ msg: "Company deleted successfully", deletedCompany });
});
//================================================4
//!=========  getCompany   =============
export const getCompany = asyncHandler(async (req, res, next) => {
  const companyId = req.params.companyId;

  const company = await companyModel.findById(companyId).populate("companyHR");
  if (!company) {
    return next(new AppError("Company not found", 404));
  }

  const jobs = await jobModel.find({ company: companyId }); // Ensure jobModel is defined
  res
    .status(200)
    .json({ msg: "Company retrieved successfully", company, jobs });
});
//================================================6
//!=========  searchCompany   =============
export const searchCompany = asyncHandler(async (req, res) => {
  const { name } = req.query;

  const companies = await companyModel.find({
    companyName: new RegExp(name, "i"),
  });
  res.status(200).json({ msg: "Companies retrieved successfully", companies });
});
//================================================7
//!=========  getApplications   =============
export const getApplications = asyncHandler(async (req, res, next) => {
  //==============================================
  try {
    const { jobId } = req.params;

    // Check if the job exists
    const job = await jobModel.findById(jobId);
    if (!job) {
      return next(new AppError("Job not found", 404));
    }

    // Ensure the authenticated user is the HR for the company that posted the job
    if (job.addedBy.toString() !== req.user._id.toString()) {
      return next(
        new AppError(
          "You do not have permission to access these applications",
          403
        )
      );
    }

    // Fetch applications for the job and populate user data
    const applications = await applicationModel
      .find({ jobId })
      .populate("userId", "firstName lastName email mobileNumber");

    res.status(200).json({
      status: "success",
      data: applications,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
});
//================================================
