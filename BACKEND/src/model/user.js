import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConnect.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      defaultValue: "GENERAL",
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("SUPERADMIN","ADMIN","OPERATOR","USER"),
      defaultValue: "USER",
      allowNull: true,
    },
    office: {
      type: DataTypes.ENUM("patna_office", "purnia_office"),
      allowNull: true,
    },
    tokenVersion: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    paranoid: true, // Enables soft deletes (deletedAt column)
  }
);

export default User;
