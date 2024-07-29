import Joi from "joi";
import mongoose from "mongoose";
//*================================================
const objectIdValidation = (value, helper) => {
    return mongoose.Types.ObjectId.isValid(value)
      ? true
      : helper.message("Invalid ID");
  };
  
//*================================================
export const generalFields = {
  email: Joi.string().email(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  //?=======================
  file: Joi.object({
    size: Joi.number().positive().required(),
    path: Joi.string().required(),
    filename: Joi.string().required(),
    destination: Joi.string().required(),
    mimetype: Joi.string().required(),
    encoding: Joi.string().required(),
    originalname: Joi.string().required(),
    fieldname: Joi.string().required(),
  }),
    //?=======================

  headers: Joi.object({
    "cache-control": Joi.string(),
    "postman-token": Joi.string(),
    "Content-Type": Joi.string(),
    "Content-Length": Joi.string(),
    host: Joi.string(),
    "user-agent": Joi.string(),
    accept: Joi.string(),
    "accept-encoding": Joi.string(),
    connection: Joi.string(),
    token: Joi.string().required(),
  }),
    //?=======================

  id: Joi.string().custom(objectIdValidation),
};
//*================================================
export default generalFields;
