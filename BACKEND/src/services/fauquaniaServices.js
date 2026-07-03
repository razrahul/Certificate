import { sequelize } from "../config/dbConnect.js";
import { QueryTypes } from "sequelize";

const fauquaniaServices = {
    async getAllFauquania() {
        try {
            const [results] = await sequelize.query("SELECT * FROM fauquania26");
            return results;
        } catch (error) {
            throw new Error("Error fetching fauquania data: " + error.message);
        }
    },
    async getfauquaniaTR(tableName, district, searchBy, searchValue) {
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
};

export default fauquaniaServices;
