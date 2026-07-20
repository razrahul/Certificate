import User from "../model/user.js";
import UpdateLog from "../model/updateLog.js";
import PrintLog from "../model/printLog.js";
// Import other models here once they are created:
// import Role from "../model/role.js";
// import Company from "../model/company.js";
// import Chat from "../model/chat.js";
// import Contact from "../model/contact.js";
// import ContactLog from "../model/contactLog.js";
// import Stats from "../model/stats.js";

export const tableSync = async () => {
  try {
    // Sync tables one by one with force: false
    // await Role.sync({ force: false });
    // await Company.sync({ force: false }); 
    await User.sync({ force: false });
    await UpdateLog.sync({ force: false });
    await PrintLog.sync({ force: false });
    
    if (process.env.NODE_ENV !== "production") {
      console.log("SQL Database tables synchronized successfully.");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
