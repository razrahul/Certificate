import logServices from "../services/logServices.js";
import { sendSuccessResponse, sendErrorResponse } from "../utils/response.js";

// Fetch daily and weekly counts of certificate updates and prints
export const getDashboardStats = async (req, res) => {
  try {
    const stats = await logServices.getDashboardStats();
    return sendSuccessResponse(res, "Dashboard stats fetched successfully", stats, 200);
  } catch (error) {
    return sendErrorResponse(res, "Error fetching dashboard stats", error.message, 500);
  }
};

// Fetch certificate update logs with pagination
export const getUpdateLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const { logs, count } = await logServices.getUpdateLogs(page, limit);

    return sendSuccessResponse(
      res,
      "Update logs fetched successfully",
      {
        logs,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      },
      200
    );
  } catch (error) {
    return sendErrorResponse(res, "Error fetching update logs", error.message, 500);
  }
};

// Fetch certificate print logs with pagination
export const getPrintLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const { logs, count } = await logServices.getPrintLogs(page, limit);

    return sendSuccessResponse(
      res,
      "Print logs fetched successfully",
      {
        logs,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      },
      200
    );
  } catch (error) {
    return sendErrorResponse(res, "Error fetching print logs", error.message, 500);
  }
};
