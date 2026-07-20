import contex from "../utils/contex.js";
import certificateServices from "../services/certificateServices.js";
import { sendSuccessResponse, sendErrorResponse } from "../utils/response.js";
import logServices from "../services/logServices.js";

export const searchCertificateTR = async (req, res) => {
  const { year, standard, district, searchBy, searchValue } = req.body;

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
      const record = await certificateServices.getcertificateTR(
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

export const updateCertificateTR = async (req, res) => {
  const { 
    year, 
    standard, 
    district, 
    searchBy, 
    searchValue, 
    Name, 
    Father, 
    Mother, 
    Madrasa, 
    DOB 
  } = req.body;

  const tableName = contex.getTableNameCertficatefromBody(year, standard);

  if (!tableName) {
    return sendErrorResponse(res, "Invalid standard and year", {}, 400);
  }

  // Build the updates object dynamically (only include fields that are passed)
  const updateFields = {};
  if (Name !== undefined) updateFields.Name = Name;
  if (Father !== undefined) updateFields.Father = Father;
  if (Mother !== undefined) updateFields.Mother = Mother;
  if (Madrasa !== undefined) updateFields.Madrasa = Madrasa;
  if (DOB !== undefined) updateFields.DOB = DOB;

  const stdLower = standard.toLowerCase();
  if (
    stdLower.startsWith("fauquania") ||
    stdLower.startsWith("moulvi") ||
    stdLower.startsWith("wastania")
  ) {
    try {
      // First, check if the record exists and retrieve current values
      const existingRecords = await certificateServices.getcertificateTR(
        tableName,
        district,
        searchBy,
        searchValue
      );

      if (!existingRecords || existingRecords.length === 0) {
        return sendErrorResponse(res, "Certificate record not found", {}, 404);
      }

      const existingRecord = existingRecords[0];

      // Compare updateFields against current database values
      const actualUpdates = {};
      let hasChanges = false;

      if (Name !== undefined && Name !== existingRecord.Name) {
        actualUpdates.Name = Name;
        hasChanges = true;
      }
      if (Father !== undefined && Father !== existingRecord.Father) {
        actualUpdates.Father = Father;
        hasChanges = true;
      }
      if (Mother !== undefined && Mother !== existingRecord.Mother) {
        actualUpdates.Mother = Mother;
        hasChanges = true;
      }
      if (Madrasa !== undefined && Madrasa !== existingRecord.Madrasa) {
        actualUpdates.Madrasa = Madrasa;
        hasChanges = true;
      }
      if (DOB !== undefined && DOB !== existingRecord.DOB) {
        actualUpdates.DOB = DOB;
        hasChanges = true;
      }

      // If no values are different, return success immediately
      if (!hasChanges) {
        return sendSuccessResponse(
          res,
          "No changes detected. Record is already up to date.",
          existingRecord,
          200
        );
      }

      // Execute dynamic update only for the changed fields
      await certificateServices.updateCertificateTR(
        tableName,
        district,
        searchBy,
        searchValue,
        actualUpdates
      );

      // Log the updates to the database
      const operatorId = req.user.id;
      const operatorUsername = req.user.username || req.user.email;

      const updatesLogData = {};
      for (const [field, newVal] of Object.entries(actualUpdates)) {
        updatesLogData[field] = {
          old: existingRecord[field] !== null && existingRecord[field] !== undefined ? String(existingRecord[field]) : null,
          new: newVal !== null && newVal !== undefined ? String(newVal) : null,
        };
      }

      await logServices.createUpdateLog({
        operatorId,
        operatorUsername,
        tableName,
        year,
        className: standard,
        certificateId: searchValue,
        district,
        updates: updatesLogData,
      });

      const updatedRecord = { ...existingRecord, ...actualUpdates };

      return sendSuccessResponse(
        res,
        "Certificate record updated successfully",
        updatedRecord,
        200
      );
    } catch (error) {
      return sendErrorResponse(res, error.message, {}, 500);
    }
  }

  return sendErrorResponse(res, "Unsupported standard", {}, 400);
};

export const logCertificatePrint = async (req, res) => {
  try {
    const { year, standard, district, searchBy, searchValue } = req.body;

    if (!year || !standard || !district || !searchBy || !searchValue) {
      return sendErrorResponse(res, "Identifying fields are required", {}, 400);
    }

    const tableName = contex.getTableNameCertficatefromBody(year, standard);
    if (!tableName) {
      return sendErrorResponse(res, "Invalid standard and year", {}, 400);
    }

    const operatorId = req.user.id;
    const operatorUsername = req.user.username || req.user.email;

    const printLog = await logServices.createPrintLog({
      operatorId,
      operatorUsername,
      tableName,
      year,
      className: standard,
      certificateId: searchValue,
      district,
    });

    return sendSuccessResponse(res, "Certificate print logged successfully", printLog, 201);
  } catch (error) {
    return sendErrorResponse(res, "Error logging certificate print", error.message, 500);
  }
};
