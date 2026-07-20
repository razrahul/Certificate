import User from "../model/user.js";
import UpdateLog from "../model/updateLog.js";
import PrintLog from "../model/printLog.js";
// Import other models here once they are created:
// import Role from "../model/role.js";
// import Company from "../model/company.js";
// import Chat from "../model/chat.js";
// import Contact from "../model/contact.js";

export const setupAssociations = () => {
  // User and UpdateLog (One-to-Many)
  User.hasMany(UpdateLog, { foreignKey: "operatorId", as: "updateLogs" });
  UpdateLog.belongsTo(User, { foreignKey: "operatorId", as: "operator" });

  // User and PrintLog (One-to-Many)
  User.hasMany(PrintLog, { foreignKey: "operatorId", as: "printLogs" });
  PrintLog.belongsTo(User, { foreignKey: "operatorId", as: "operator" });

  // Role and User (One-to-Many)
  // User.belongsTo(Role, { foreignKey: "roleId", targetKey: "uuId", as: "role" });
  // Role.hasMany(User, { foreignKey: "roleId", sourceKey: "uuId", as: "users" });

  // Company and User (One-to-Many)
  // User.belongsTo(Company, { foreignKey: "company", targetKey: "uuId", as: "companyData" });
  // Company.hasMany(User, { foreignKey: "company", sourceKey: "uuId", as: "users" });

  // Chat and Contact (One-to-Many)
  // Contact.belongsTo(Chat, { foreignKey: "chat", targetKey: "uuId", as: "chatData" });
  // Chat.hasMany(Contact, { foreignKey: "chat", sourceKey: "uuId", as: "contacts" });

  if (process.env.NODE_ENV !== "production") {
    console.log("Model associations set up successfully.");
  }
};
