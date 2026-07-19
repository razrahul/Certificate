import { sequelize } from "../config/dbConnect.js";
import { QueryTypes } from "sequelize";

const fauquaniaServices = {
    async getAllcertificate() {
        try {
            const [results] = await sequelize.query("SELECT * FROM fauquania26");
            return results;
        } catch (error) {
            throw new Error("Error fetching fauquania data: " + error.message);
        }
    },
    async getcertificateTR(tableName, district, searchBy, searchValue) {
        try {
            const columnName = String(searchBy).trim();

            if (!["Rgn", "RollNo"].includes(columnName)) {
                throw new Error("Invalid searchBy field");
            }

            const results = await sequelize.query(
                `SELECT * FROM ${tableName} WHERE District = ? AND ${columnName} = ?`,
                {
                    replacements: [district.toUpperCase(), searchValue],
                    type: QueryTypes.SELECT,
                }
            );
            return results;
        } catch (error) {
            throw new Error("Error fetching fauquania data: " + error.message);
        }
    },
    async updateCertificateTR(tableName, district, searchBy, searchValue, updateFields) {
        try {
            const columnName = String(searchBy).trim();

            if (!["Rgn", "RollNo"].includes(columnName)) {
                throw new Error("Invalid searchBy field");
            }

            // Map frontend fields to DB columns
            const fieldMapping = {
                Name: "Name",
                Father: "Father",
                Mother: "Mother",
                Madrasa: "Madrasa",
                DOB: "DOB"
            };

            const setClauses = [];
            const replacements = [];

            // Add only the provided fields to the SQL UPDATE query
            for (const [key, dbColumn] of Object.entries(fieldMapping)) {
                if (updateFields[key] !== undefined) {
                    setClauses.push(`${dbColumn} = ?`);
                    replacements.push(updateFields[key]);
                }
            }

            if (setClauses.length === 0) {
                throw new Error("No fields provided for update");
            }

            // Add identifiers for the WHERE clause
            replacements.push(district.toUpperCase());
            replacements.push(searchValue);

            // Execute dynamic UPDATE query
            const [result, metadata] = await sequelize.query(
                `UPDATE ${tableName} 
                 SET ${setClauses.join(", ")}
                 WHERE District = ? AND ${columnName} = ?`,
                {
                    replacements,
                    type: QueryTypes.UPDATE,
                }
            );

            // Return affectedRows to know if any records were matched
            return result?.affectedRows || metadata?.affectedRows || 0;
        } catch (error) {
            throw new Error("Error updating certificate data: " + error.message);
        }
    },
};

export default fauquaniaServices;
