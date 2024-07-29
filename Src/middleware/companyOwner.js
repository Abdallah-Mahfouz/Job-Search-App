import { AppError } from "../utils/appError.js";
import companyModel from "../../Models/company.Models.js";

//================================================

export const isCompanyOwner = async (req, res, next) => {
  // Retrieve the companyId from either the request parameters or the request body
  const companyId = req.params.companyId || req.body.companyId;

  const company = await companyModel.findById(companyId);

  //  Check if the company exists
  if (!company) {
    return next(new AppError("Company not found", 404));
  }

  //  Check if the currently authenticated user is the owner (HR) of the company
  if (company.companyHR.toString() !== req.user._id.toString()) {
    return next(
      new AppError(
        "You don't have permission to access this company's data",
        401
      )
    );
  }

  next();
};
