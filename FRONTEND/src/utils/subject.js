export const fauquania = {
  compulsory_subjects: [
    "DINIYAT",
    "URDU",
    "PERSIAN",
    "ARABIC",
    "HINDI",
    "ENGLISH",
    "SOCIAL STUDY",
    "MATHEMATICS",
    "SCIENCE",
  ],
  subjects: [
    {
      type: "simple",
      databaseName: "DIN_I",
      name: "DINIYAT PAPER - I",
      fullMarks: 100,
      passMarks: 33,
    },
    {
      type: "simple",
      databaseName: "DIN_II",
      name: "DINIYAT PAPER - II",
      fullMarks: 100,
      passMarks: 33,
    },
    {
      type: "simple",
      databaseName: "DIN_TOT",
      name: "TOTAL",
      fullMarks: 200,
      passMarks: 66,
    },
    {
      type: "simple",
      databaseName: "URDU",
      name: "URDU",
      fullMarks: 100,
      passMarks: 30,
    },
    {
      type: "simple",
      databaseName: "PER",
      name: "PERSIAN",
      fullMarks: 100,
      passMarks: 30,
    },
    {
      type: "simple",
      databaseName: "ARB",
      name: "ARABIC",
      fullMarks: 100,
      passMarks: 30,
    },
    {
      type: "simple",
      databaseName: "HIN",
      name: "HINDI",
      fullMarks: 100,
      passMarks: 30,
    },
    {
      type: "simple",
      databaseName: "ENG",
      name: "ENGLISH",
      fullMarks: 100,
      passMarks: 30,
    },
    {
      type: "simple",
      databaseName: "SST",
      name: "SOCIAL STUDY",
      fullMarks: 100,
      passMarks: 30,
    },
    {
      type: "simple",
      databaseName: "MAT",
      name: "MATHEMATICS",
      fullMarks: 100,
      passMarks: 30,
    },
    {
      type: "composite",
      databaseName: "SC",
      name: "SCIENCE (Theory + Practical)",
      fullMarks: 100,
      passMarks: 33,
      parts: [
        {
          databaseName: "SCT",
          name: "Theory",
          fullMarks: 80,
          passMarks: 25,
        },
        {
          databaseName: "SCP",
          name: "Practical",
          fullMarks: 20,
          passMarks: 8,
        },
        {
          databaseName: "SCTOT",
          name: "SCIENCE TOTAL",
          fullMarks: 100,
          passMarks: 33,
        },
      ],
    },
    {
      type: "total",
      databaseName: "TotMs",
      name: "TOTAL / AGGREGATE",
      displayNameMarksheet: "AGGREGATE",
      displayNameCertificate: "TOTAL",
      fullMarks: 1000,
      passMarks: 309,
    },
  ],
};

export const getObtainedMarks = (student, subjectConfig) => {
  if (!student || !subjectConfig) return 0;

  const dbName = subjectConfig.databaseName;

  // 1. If it's a composite subject, calculate its parts or use SCTOT
  if (subjectConfig.type === "composite") {
    const totField = subjectConfig.parts.find((p) => p.databaseName === "SCTOT") || {};
    return getObtainedMarks(student, totField);
  }

  // 2. Resolve raw mark
  const rawMark = student[dbName];

  // Handle absent 'AB' or dots '.'
  if (rawMark === "AB" || rawMark === "Ab") return "AB";
  if (!rawMark || String(rawMark).trim() === "." || String(rawMark).trim() === "") return "0";
  
  const markNum = Number(rawMark);

  // 3. Resolve grace marks if they exist
  let graceKey = "";
  if (dbName === "DIN_TOT") {
    graceKey = "DINGr";
  } else if (dbName === "SCTOT") {
    graceKey = "SCGr";
  } else if (["URDU", "PER", "ARB", "HIN", "ENG", "SST", "MAT"].includes(dbName)) {
    graceKey = dbName + "Gr";
  }

  const graceNum = graceKey && student[graceKey] && student[graceKey] !== "." ? Number(student[graceKey]) : 0;

  return markNum + graceNum;
};

export const publicationDates = {
  WASTANIA: {
    2026: { marksheet: "2026-02-10", certificate: "2026-02-10" },
    2025: { marksheet: "2025-02-10", certificate: "2025-02-10" },
    2024: { marksheet: "2024-02-10", certificate: "2024-02-10" },
  },
  FAUQUANIA: {
    2026: { marksheet: "2026-02-10", certificate: "2026-02-10" },
    2025: { marksheet: "2025-02-10", certificate: "2025-02-10" },
    2024: { marksheet: "2024-02-10", certificate: "2024-02-10" },
  },
  "MOULVI SCIENCE": {
    2026: { marksheet: "2026-02-10", certificate: "2026-02-10" },
    2025: { marksheet: "2025-02-10", certificate: "2025-02-10" },
    2024: { marksheet: "2024-02-10", certificate: "2024-02-10" },
  },
  "MOULVI ARTS": {
    2026: { marksheet: "2026-02-10", certificate: "2026-02-10" },
    2025: { marksheet: "2025-02-10", certificate: "2025-02-10" },
    2024: { marksheet: "2024-02-10", certificate: "2024-02-10" },
  },
  "MOULVI ISLAMIAT": {
    2026: { marksheet: "2026-02-10", certificate: "2026-02-10" },
    2025: { marksheet: "2025-02-10", certificate: "2025-02-10" },
    2024: { marksheet: "2024-02-10", certificate: "2024-02-10" },
  },
  "MOULVI COMMERCE": {
    2026: { marksheet: "2026-02-10", certificate: "2026-02-10" },
    2025: { marksheet: "2025-02-10", certificate: "2025-02-10" },
    2024: { marksheet: "2024-02-10", certificate: "2024-02-10" },
  },
};

export const getPublicationDate = (className, year, type = "certificate") => {
  if (!className || !year) return "";

  const normClass = String(className).toUpperCase().trim();
  const normYear = String(year).trim();

  // Find class key in lookup mapping
  let classDates = publicationDates[normClass];

  if (!classDates) {
    // Substring fallback check (e.g. "MOULVI SCIENCE" vs "MOULVI")
    const matchingKey = Object.keys(publicationDates).find(
      (key) => normClass.includes(key) || key.includes(normClass)
    );
    if (matchingKey) {
      classDates = publicationDates[matchingKey];
    }
  }

  if (!classDates) {
    // If class not matched in list, return default template date using search year
    return `${normYear}-02-10`;
  }

  const dates = classDates[normYear];
  if (!dates) {
    return `${normYear}-02-10`;
  }

  return dates[type] || dates.marksheet || "";
};