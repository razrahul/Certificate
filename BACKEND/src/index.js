import express from "express";
import cors from "cors";
import { connectMongoDB, connectSqlDB } from "./config/dbConnect.js";
import indexRouter from "./router/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }))

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON body. Please check missing commas or brackets.",
    });
  }

  return next(err);
});

app.use(express.static("public"));

app.use("/api/v1", indexRouter);



const port = process.env.PORT || 3000;

await connectMongoDB();
await connectSqlDB();

app.listen(port, () => {
  console.log("Server running on http://localhost:" + port);
});
