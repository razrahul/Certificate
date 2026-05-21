import dotenv from "dotenv";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const env = process.env.NODE_ENV || "development";

const sqlConfigs = {
  development: {
    username: process.env.SQLDB_USERNAME,
    password: process.env.SQLDB_PASSWORD,
    database: process.env.SQLDB_DATABASE,
    host: process.env.SQLDB_HOST,
    port: Number(process.env.SQLDB_PORT || 3306),
    dialect: "mysql",
    logging: console.log,
  },
  staging: {
    username: process.env.SQLDB_USERNAME,
    password: process.env.SQLDB_PASSWORD,
    database: process.env.SQLDB_DATABASE,
    host: process.env.SQLDB_HOST,
    port: Number(process.env.SQLDB_PORT || 3306),
    dialect: "mysql",
    logging: console.log,
  },
  production: {
    username: process.env.SQLDB_USERNAME,
    password: process.env.SQLDB_PASSWORD,
    database: process.env.SQLDB_DATABASE,
    host: process.env.SQLDB_HOST,
    port: Number(process.env.SQLDB_PORT || 3306),
    dialect: "mysql",
    logging: false,
  },
};

const mongoConfigs = {
  development: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017/certificate",
  },
  staging: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017/certificate",
  },
  production: {
    uri: process.env.MONGO_URI,
  },
};

export const SqlConfig = sqlConfigs[env] || sqlConfigs.development;
export const MongoConfig = mongoConfigs[env] || mongoConfigs.development;
