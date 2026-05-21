import express from "express";
import certificateRouter from "./certificateRouter.js";
import userRouter from "./userRouter.js";

const indexRouter = express.Router();

indexRouter.use("/certificate", certificateRouter);
indexRouter.use("/user", userRouter);


export default indexRouter;
