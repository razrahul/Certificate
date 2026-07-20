import express from "express";
import certificateRouter from "./certificateRouter.js";
import userRouter from "./userRouter.js";
import logRouter from "./logRouter.js";

const indexRouter = express.Router();

indexRouter.use("/certificate", certificateRouter);
indexRouter.use("/user", userRouter);
indexRouter.use("/logs", logRouter);

export default indexRouter;
