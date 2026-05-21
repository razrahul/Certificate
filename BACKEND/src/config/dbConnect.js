import mongoose from "mongoose";
import { Sequelize } from "sequelize";
import { SqlConfig, MongoConfig } from "./database.js";

export const sequelize = new Sequelize(
  SqlConfig.database,
  SqlConfig.username,
  SqlConfig.password,
  {
    host: SqlConfig.host,
    port: SqlConfig.port,
    dialect: SqlConfig.dialect,
    logging: SqlConfig.logging,
  },
);

export const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(
      MongoConfig.uri || "mongodb://localhost:27017/certificate",
    );
    console.log("Connected to MongoDB");
    return conn;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export const connectSqlDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to SQL Database");
    return sequelize;
  } catch (err) {
    console.error("SQL connection failed:", err.message);
    process.exit(1);
  }
};
