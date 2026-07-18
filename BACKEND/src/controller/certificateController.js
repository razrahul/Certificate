import contex from "../utils/contex.js";
import fauquaniaServices from "../services/fauquaniaServices.js";
import { sendSuccessResponse, sendErrorResponse } from "../utils/response.js";

export const searchCertificateTR = async (req, res) => {
  const { year, standard, district, searchBy, searchValue } = req.body;

  if (!year || !standard || !district || !searchBy || !searchValue) {
    return sendErrorResponse(
      res,
      "Year, standard, district, searchBy and searchValue are required",
      {},
      400
    );
  }

  const tableName = contex.getTableNameCertficatefromBody(year, standard);

  if (!tableName) {
    return sendErrorResponse(res, "Invalid standard and year", {}, 400);
  }

  const stdLower = standard.toLowerCase();
  if (
    stdLower.startsWith("fauquania") ||
    stdLower.startsWith("moulvi") ||
    stdLower.startsWith("wastania")
  ) {
    try {
      const record = await fauquaniaServices.getfauquaniaTR(
        tableName,
        district,
        searchBy,
        searchValue
      );

      if (!record || record.length === 0) {
        return sendErrorResponse(res, "Certificate record not found", {}, 404);
      }
      
      return sendSuccessResponse(
        res,
        "Certificate record fetched successfully",
        record[0] || null,
        200
      );
    } catch (error) {
      return sendErrorResponse(res, error.message, {}, 500);
    }
  }

  return sendErrorResponse(res, "Unsupported standard", {}, 400);
};
