import { Op } from "sequelize";
import UpdateLog from "../model/updateLog.js";
import PrintLog from "../model/printLog.js";

const logServices = {
  // Create an update log entry
  async createUpdateLog(data) {
    try {
      return await UpdateLog.create(data);
    } catch (error) {
      throw new Error("Error creating update log: " + error.message);
    }
  },

  // Create a print log entry
  async createPrintLog(data) {
    try {
      return await PrintLog.create(data);
    } catch (error) {
      throw new Error("Error creating print log: " + error.message);
    }
  },

  // Get daily and weekly stats summaries
  async getDashboardStats() {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const dailyUpdates = await UpdateLog.count({
        where: { createdAt: { [Op.gte]: todayStart } },
      });

      const weeklyUpdates = await UpdateLog.count({
        where: { createdAt: { [Op.gte]: sevenDaysAgo } },
      });

      const dailyPrints = await PrintLog.count({
        where: { createdAt: { [Op.gte]: todayStart } },
      });

      const weeklyPrints = await PrintLog.count({
        where: { createdAt: { [Op.gte]: sevenDaysAgo } },
      });

      return {
        updates: { daily: dailyUpdates, weekly: weeklyUpdates },
        prints: { daily: dailyPrints, weekly: weeklyPrints },
      };
    } catch (error) {
      throw new Error("Error calculating dashboard statistics: " + error.message);
    }
  },

  // Get paginated update logs
  async getUpdateLogs(page, limit) {
    try {
      const offset = (page - 1) * limit;
      const { count, rows } = await UpdateLog.findAndCountAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });
      return { logs: rows, count };
    } catch (error) {
      throw new Error("Error fetching update logs: " + error.message);
    }
  },

  // Get paginated print logs
  async getPrintLogs(page, limit) {
    try {
      const offset = (page - 1) * limit;
      const { count, rows } = await PrintLog.findAndCountAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });
      return { logs: rows, count };
    } catch (error) {
      throw new Error("Error fetching print logs: " + error.message);
    }
  },
};

export default logServices;
