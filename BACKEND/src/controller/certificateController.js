const certificateRecords = [
  {
    id: "std-001",
    studentName: "Md Ayan Raza",
    fatherName: "Md Rahman",
    motherName: "Sakina Khatoon",
    district: "Patna",
    standard: "Fauquania",
    className: "Fauquania",
    rollNo: "1428",
    registrationNo: "REG-2026-0084",
    year: "2026",
    marks: "384",
    division: "First",
  },
  {
    id: "std-002",
    studentName: "Saba Parween",
    fatherName: "Abdul Karim",
    motherName: "Rukhsana Bano",
    district: "Purnea",
    standard: "Moulvi",
    className: "Moulvi",
    rollNo: "2195",
    registrationNo: "REG-2026-0412",
    year: "2026",
    marks: "421",
    division: "First",
  },
  {
    id: "std-003",
    studentName: "Nazia Firdaus",
    fatherName: "Imran Alam",
    motherName: "Shaheen Ara",
    district: "Gaya",
    standard: "Wastania",
    className: "Wastania",
    rollNo: "0876",
    registrationNo: "REG-2026-0197",
    year: "2026",
    marks: "312",
    division: "First",
  },
];

export const searchCertificate = (req, res) => {
  const { year, standard, district, searchBy, searchValue } = req.body;

  if (!year || !standard || !district || !searchBy || !searchValue) {
    return res.status(400).json({
      message: "Year, standard, district, search by and search value are required",
    });
  }

  const record = certificateRecords.find((item) => {
    const requestedValue = String(searchValue).trim().toLowerCase();
    const itemValue = String(item[searchBy] || "").trim().toLowerCase();

    return (
      item.year === year &&
      item.standard === standard &&
      item.district === district &&
      itemValue === requestedValue
    );
  });

  if (!record) {
    return res.status(404).json({ message: "Certificate record not found" });
  }

  return res.status(200).json({
    status: "success",
    message: "Certificate record fetched successfully",
    data: record,
  });
};
