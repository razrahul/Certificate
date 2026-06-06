import contex from "../utils/contex.js";
import fauquaniaServices from "../services/fauquaniaServices.js";


export const searchCertificateTR = async (req, res) => {
  const { year, standard, district, searchBy, searchValue } = req.body;

  if (!year || !standard || !district || !searchBy || !searchValue) {
    return res.status(400).json({
      message: "Year, standard, district, searchBy and searchValue are required",
    });
  }

  const tableName = contex.getTableNameCertficatefromBody(year, standard);

  if (!tableName) {
    return res.status(400).json({ message: "Invalid standard and year" });
  }

  if (standard.toLowerCase() === "fauquania") {
    try {
      const fauquania = await fauquaniaServices.getfauquaniaTR(
        tableName,
        district,
        searchBy,
        searchValue,  
      );

      if (!fauquania || fauquania.length === 0) {
        return res.status(404).json({ 
          message: "Certificate record not found" });
      }
      return res.status(200).json({
        status: "success",
        message: "Certificate record fetched successfully",
        data: fauquania[0] || null,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  return res.status(400).json({ message: "Unsupported standard" });
};
