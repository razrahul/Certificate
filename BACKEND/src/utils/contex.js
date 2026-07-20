const tableNames = {
    fauquania: {
        2026: "fauquania26",
        2025: "fauquania25",
        2024: "fauquania24",
    },
    moulvi: {
        2026: "moulvi26",
        2025: "moulvi25",
        2024: "moulvi24",
    },
}


const getTableNameCertificate = (year, standard) => {
    return tableNames[standard.toLowerCase()]?.[year];
};


const getTableNameCertficatefromBody = (year, standard) => {
    const lastTwoDigits = String(year).slice(-2);
    const stdLower = String(standard).toLowerCase().trim();

    let prefix = stdLower;
    if (stdLower.startsWith("moulvi")) {
        prefix = "moulvi";
    } else if (stdLower.startsWith("fauquania")) {
        prefix = "fauquania";
    } else if (stdLower.startsWith("wastania")) {
        prefix = "wastania";
    }

    const tableName = `${prefix}${lastTwoDigits}`;
    return tableName;
};


const contex = {
    getTableNameCertificate,
    getTableNameCertficatefromBody,
    tableName: tableNames,
};

export default contex;
