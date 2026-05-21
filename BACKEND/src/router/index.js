import express from "express";
import userRouter from "./userRouter.js";

const indexRouter = express.Router();

indexRouter.use("/user", userRouter);


export default indexRouter;