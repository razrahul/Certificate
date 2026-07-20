import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConnect.js";

const PrintLog = sequelize.define(
  "PrintLog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    operatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    operatorUsername: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tableName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    className: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    certificateId: {
      type: DataTypes.STRING, // e.g. RollNo or Rgn
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "print_logs",
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

export default PrintLog;
