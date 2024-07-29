import multer from "multer";
import { nanoid } from "nanoid";
import { AppError } from "../Src/utils/appError.js";
import path from "path";
import fs from "fs";
//*================================================================
export const validExtension = {
  image: ["image/png", "image/jpg", "image/jpeg"],
  video: ["video/mp4", "video/mkv", "video/avi", "video/mov"],
  pdf: ["application/pdf"],
};
//?==================
export const multerLocal = (
  customValidation = ["image/png"],
  customPath = "generals"
) => {
  const allPath = path.resolve(`uploads/${customPath}`); //resolve the path to the uploads directory
  if (!fs.existsSync(allPath)) {
    fs.mkdirSync(allPath, { recursive: true }); // create folder if it doesn't exist
  }
  //?==================
  // ! 1->destination
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, allPath);
    },
    //?==================
    // ! 2->filename
    filename: function (req, file, cb) {
      cb(null, nanoid(4) + file.originalname);
    },
  });
  //?==================
  //! fileFilter
  const fileFilter = (req, file, cb) => {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("file not supported"), false);
    }
  };
  //?==================
  const upload = multer({ fileFilter, storage });
  return upload;
};

