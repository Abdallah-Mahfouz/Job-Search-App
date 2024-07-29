import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectionDB from "./DB/connectionDB.js";
import companyRouter from "./Src/Modules/company/company.Routes.js";
import userRouter from "./Src/Modules/user/user.Routes.js";
import jopRouter from "./Src/Modules/job/job.Routes.js";
import { AppError } from "./Src/utils/appError.js";
import { globalError } from "./Src/utils/globalError.js";
//?================================================
const app = express();
const port = process.env.PORT || 3001;
//?===================
connectionDB();
//?===================
app.use(express.json());
app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/job", jopRouter);
//?===================
//! error route handler
app.use("*", (req, res, next) =>
  next(new AppError(`invalid route${req.originalUrl}`, 404))
);
//?===================
//! global error handler middleware
app.use(globalError);
//?================================================================
app.listen(port, () => console.log(`app listening on port ${port}!`));
