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

export const getSubjectDbKey = (name) => {
  if (!name) return "";
  const upper = name.trim().toUpperCase();
  if (upper.includes("ARABIC")) return "ARB";
  if (upper.includes("URDU")) return "URDU";
  if (upper.includes("PERSIAN")) return "PER";
  if (upper.includes("ENGLISH")) return "ENG";
  if (upper.includes("HINDI")) return "HIN";
  if (upper.includes("SOCIAL STUDY")) return "SST";
  if (upper.includes("MATHEMATICS")) return "MAT";
  return upper;
};

export const STREAM_SCHEMAS = {
  "ISLAMIYAT": ["TARIKH-E-ISLAM", "ISLAMIC POL. & ECO.", "ISLAMIC HISTORY", "ISLAMIC JURISPRUDENCE"],
  "SCIENCE": ["PHYSICS", "CHEMISTRY"],
  "COMMERCE": ["ACCOUNTANCY", "BUSINESS STUDIES", "ENTREPRENEURSHIP"],
  "ARTS": [] // Arts has only Diniyat, Arabic, Urdu as compulsory; all others from OptSub1-4 are optional
};

export const getMoulviSubjects = (student) => {
  if (!student) return { compulsory: [], optional: [] };

  const streamName = String(student.Stream || "").toUpperCase().trim();

  // Helper to parse subject marks & details
  const getObtainedVal = (raw) => {
    if (raw === "AB" || raw === "Ab") return "AB";
    if (!raw || String(raw).trim() === "." || String(raw).trim() === "") return "0";
    return Number(raw);
  };

  // Helper to parse Compulsory Comp2 & Comp3
  const getCompulsorySubject = (subName) => {
    if (!subName) return { name: "", theory: "", total: 0, grace: "" };
    const dbKey = getSubjectDbKey(subName);
    const rawMark = student[dbKey];
    const graceKey = dbKey + "Gr";
    const graceVal = student[graceKey] && student[graceKey] !== "." ? student[graceKey] : "";
    return {
      name: getSubjectDisplayName(subName),
      theory: rawMark || "",
      grace: graceVal,
      total: getObtainedVal(rawMark) + (graceVal ? Number(graceVal) : 0)
    };
  };

  // Helper to search OptSub1 to OptSub4 by name pattern
  const findOptSubject = (pattern) => {
    for (let i = 1; i <= 4; i++) {
      const subName = student[`OptSub${i}`];
      if (subName && subName.trim().toUpperCase().includes(pattern.toUpperCase())) {
        const theoryVal = student[`OPT${i}`];
        const practicalVal = student[`OPT${i}_Pr`] && student[`OPT${i}_Pr`] !== "." ? student[`OPT${i}_Pr`] : "";
        const totalVal = student[`OPT${i}_Tot`] || student[`OPT${i}`];
        const graceVal = student[`OPT${i}Gr`] && student[`OPT${i}Gr`] !== "." ? student[`OPT${i}Gr`] : "";
        
        return {
          name: getSubjectDisplayName(subName),
          theory: theoryVal || "",
          practical: practicalVal || "",
          total: getObtainedVal(totalVal) + (graceVal ? Number(graceVal) : 0),
          grace: graceVal
        };
      }
    }
    return null;
  };

  const compulsory = [];
  const optional = [];

  // DINIYAT (Comp1)
  const diniyatSub = {
    name: student.Comp1 || "DINIYAT",
    isDiniyat: true,
    paper1: student.DIN_I || "",
    paper2: student.DIN_II || "",
    paper3: student.DIN_III || "",
    total: getObtainedVal(student.DIN_TOT),
    grace: student.DINGr && student.DINGr !== "." ? student.DINGr : ""
  };
  compulsory.push(diniyatSub);

  // ARABIC (Comp2)
  const arabicSub = getCompulsorySubject(student.Comp2 || "ARABIC");
  compulsory.push(arabicSub);

  // URDU (Comp3)
  const urduSub = getCompulsorySubject(student.Comp3 || "URDU");
  compulsory.push(urduSub);

  // Get common language subject (English/Hindi/Persian)
  const langSub = findOptSubject("ENGLISH") || findOptSubject("HINDI") || findOptSubject("PERSIAN") || {
    name: "ENGLISH/HINDI/PERSIAN",
    theory: "",
    practical: "",
    total: 0,
    grace: ""
  };

  if (streamName.includes("ISLAMIYAT")) {
    // Compulsory: Diniyat, Arabic, Urdu, Tarikh-e-Islam, Islamic Pol. & Eco.
    const tarikhSub = findOptSubject("TARIKH") || findOptSubject("ISLAMIC HISTORY") || { name: "TARIKH-E-ISLAM", theory: "", total: 0 };
    const polSub = findOptSubject("POL") || findOptSubject("ECO") || { name: "ISLAMIC POL. & ECO.", theory: "", total: 0 };
    
    compulsory.push(tarikhSub);
    compulsory.push(polSub);

    // Optional: English/Hindi/Persian
    optional.push(langSub);
  } 
  else if (streamName.includes("COMMERCE")) {
    // Compulsory: Diniyat, Arabic, Urdu, Business Study, Accountancy
    const bsSub = findOptSubject("BUSINESS") || { name: "BUSINESS STUDY", theory: "", total: 0 };
    const accSub = findOptSubject("ACCOUNT") || { name: "ACCOUNTANCY", theory: "", total: 0 };
    
    compulsory.push(bsSub);
    compulsory.push(accSub);

    // Optional: Economics/Entrepreneurship, English/Hindi/Persian
    const econSub = findOptSubject("ECON") || findOptSubject("ENTR") || { name: "ECONOMICS/ENTERPRENURSHIP", theory: "", total: 0 };
    optional.push(econSub);
    optional.push(langSub);
  } 
  else if (streamName.includes("SCIENCE")) {
    // Compulsory: Diniyat, Arabic, Urdu, Physics, Chemistry
    const phySub = findOptSubject("PHYSICS") || { name: "PHYSICS", theory: "", practical: "", total: 0 };
    const chemSub = findOptSubject("CHEMISTRY") || { name: "CHEMISTRY", theory: "", practical: "", total: 0 };
    
    compulsory.push(phySub);
    compulsory.push(chemSub);

    // Optional: Math or Biology, English/Hindi/Persian
    const mathOrBioSub = findOptSubject("MATH") || findOptSubject("BIOLOGY") || { name: "MATHEMATICS", theory: "", total: 0 };
    optional.push(mathOrBioSub);
    optional.push(langSub);
  } 
  else {
    // ARTS Stream (Default)
    // Compulsory: Diniyat, Arabic, Urdu only

    // Optional: 3 custom optionals from OptSub1..4 that are not Arabic/Urdu/Language
    const customOpts = [];
    for (let i = 1; i <= 4; i++) {
      const subName = student[`OptSub${i}`];
      if (!subName || subName.trim() === "" || subName.trim() === ".") continue;
      const upper = subName.toUpperCase();
      
      // Skip language optionals and compulsory names to prevent duplicates
      if (["ENGLISH", "HINDI", "PERSIAN", "ARABIC", "URDU"].some(skip => upper.includes(skip))) continue;
      
      const theoryVal = student[`OPT${i}`];
      const practicalVal = student[`OPT${i}_Pr`] && student[`OPT${i}_Pr`] !== "." ? student[`OPT${i}_Pr`] : "";
      const totalVal = student[`OPT${i}_Tot`] || student[`OPT${i}`];
      const graceVal = student[`OPT${i}Gr`] && student[`OPT${i}Gr`] !== "." ? student[`OPT${i}Gr`] : "";
      
      customOpts.push({
        name: subName.toUpperCase().trim(),
        theory: theoryVal || "",
        practical: practicalVal || "",
        total: getObtainedVal(totalVal) + (graceVal ? Number(graceVal) : 0),
        grace: graceVal
      });
    }

    // Arts has exactly 3 custom optional subject slots in template (fill remaining with dotted name)
    for (let i = 0; i < 3; i++) {
      if (customOpts[i]) {
        optional.push(customOpts[i]);
      } else {
        optional.push({ name: "..............................", theory: "", practical: "", total: "", isPlaceholder: true });
      }
    }
    
    optional.push(langSub);
  }

  return { compulsory, optional };
};

export const SUBJECT_ORDER = [
  "DINIYAT",
  "ARABIC",
  "URDU",
  "TARIKH-E-ISLAM",
  "ISLAMIC POL. & ECO.",
  "PHYSICS",
  "CHEMISTRY",
  "BUSINESS STUDY",
  "BUSINESS STUDIES",
  "ACCOUNTANCY",
  "ECONOMICS/ENTREPRENEURSHIP",
  "MATHEMATICS",
  "BIOLOGY",
  "GEOGRAPHY",
  "PSYCHOLOGY",
  "HOME SCIENCE",
  "ENGLISH/HINDI/PERSIAN"
];

export const getSubjectOrderIndex = (name) => {
  if (!name) return 999;
  const upper = name.trim().toUpperCase();
  if (upper === "ENGLISH/HINDI/PERSIAN") return 1000; // Always absolute last!
  
  const idx = SUBJECT_ORDER.findIndex(sub => upper.includes(sub));
  return idx !== -1 ? idx : 500; // Custom subjects sort before language options
};

export const getSubjectDisplayName = (name) => {
  if (!name) return "";
  const upper = name.trim().toUpperCase();
  if (upper === "HINDI" || upper === "ENGLISH" || upper === "PERSIAN" || upper === "ENGLISH/HINDI/PERSIAN") {
    return "ENGLISH/HINDI/PERSIAN";
  }
  if (upper === "ECONOMICS" || upper === "ENTREPRENEURSHIP" || upper === "ECONOMICS/ENTREPRENEURSHIP" || upper.includes("ECON") || upper.includes("ENTR")) {
    return "ECONOMICS/ENTREPRENEURSHIP";
  }
  return name;
};

export const getMoulviSubjectConfig = (name) => {
  if (!name) return { type: "simple", fullTotal: 100, passTotal: 30 };
  const upper = name.trim().toUpperCase();
  const practicalSubjects = ["PHYSICS", "CHEMISTRY", "BIOLOGY", "GEOGRAPHY", "PSYCHOLOGY", "HOME SCIENCE"];
  const isPractical = practicalSubjects.some(sub => upper.includes(sub));

  if (isPractical) {
    return {
      type: "composite",
      fullTheory: 70,
      fullPractical: 30,
      fullTotal: 100,
      passTheory: 21,
      passPractical: 12,
      passTotal: 33
    };
  }

  return {
    type: "simple",
    fullTotal: 100,
    passTotal: 30
  };
};