import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CASES, DISTRICTS, CRIME_HEADS } from "../src/data/mock.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../catalyst_csvs");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function toCSV(headers, rows) {
  const headerLine = headers.join(",");
  const bodyLines = rows.map((r) =>
    headers
      .map((h) => {
        let val = r[h];
        if (val === undefined || val === null) val = "";
        val = String(val).replace(/"/g, '""');
        if (val.includes(",") || val.includes('"') || val.includes("\n")) {
          val = `"${val}"`;
        }
        return val;
      })
      .join(",")
  );
  return [headerLine, ...bodyLines].join("\n");
}

// 1. CaseMaster.csv
const caseMasterRows = CASES.map((c) => ({
  CaseMasterID: c.caseMasterId,
  CrimeNo: c.crimeNo,
  CaseNo: c.crimeNo.slice(-9),
  CrimeRegisteredDate: c.registeredDate,
  IncidentFromDate: `${c.incidentDate} 08:00:00`,
  IncidentToDate: `${c.incidentDate} 18:00:00`,
  PoliceStationID: (c.district.id * 10) + 1,
  CaseCategoryID: c.category === "FIR" ? 1 : c.category === "UDR" ? 2 : 3,
  GravityOffenceID: c.gravity === "Heinous" ? 1 : 2,
  CrimeMajorHeadID: c.crimeHead.id,
  latitude: c.latitude,
  longitude: c.longitude,
  BriefFacts: c.briefFacts,
}));
fs.writeFileSync(
  path.join(outDir, "CaseMaster.csv"),
  toCSV(Object.keys(caseMasterRows[0]), caseMasterRows)
);

// 2. ComplainantDetails.csv
let complainantIdCounter = 1;
const complainantRows = CASES.map((c) => ({
  ComplainantID: complainantIdCounter++,
  CaseMasterID: c.caseMasterId,
  ComplainantName: c.complainant.name,
  AgeYear: c.complainant.age,
  GenderID: c.complainant.gender === "M" ? 1 : 2,
}));
fs.writeFileSync(
  path.join(outDir, "ComplainantDetails.csv"),
  toCSV(Object.keys(complainantRows[0]), complainantRows)
);

// 3. Victim.csv
let victimIdCounter = 1;
const victimRows = CASES.flatMap((c) =>
  c.victims.map((v) => ({
    VictimMasterID: victimIdCounter++,
    CaseMasterID: c.caseMasterId,
    VictimName: v.name,
    AgeYear: v.age,
    GenderID: v.gender === "M" ? 1 : 2,
  }))
);
fs.writeFileSync(
  path.join(outDir, "Victim.csv"),
  toCSV(Object.keys(victimRows[0]), victimRows)
);

// 4. Accused.csv
let accusedIdCounter = 1;
const accusedRows = CASES.flatMap((c) =>
  c.accused.map((a) => ({
    AccusedMasterID: accusedIdCounter++,
    CaseMasterID: c.caseMasterId,
    AccusedName: a.name,
    AgeYear: a.age,
    GenderID: a.gender === "M" ? 1 : 2,
    PersonID: a.id,
  }))
);
fs.writeFileSync(
  path.join(outDir, "Accused.csv"),
  toCSV(Object.keys(accusedRows[0]), accusedRows)
);

// 5. District.csv
const districtRows = DISTRICTS.map((d) => ({
  DistrictID: d.id,
  DistrictName: d.name,
  Population: d.population,
  UrbanizationPct: d.urbanization,
  LiteracyPct: d.literacy,
}));
fs.writeFileSync(
  path.join(outDir, "District.csv"),
  toCSV(Object.keys(districtRows[0]), districtRows)
);

// 6. CrimeHead.csv
const crimeHeadRows = CRIME_HEADS.map((ch) => ({
  CrimeHeadID: ch.id,
  CrimeGroupName: ch.name,
}));
fs.writeFileSync(
  path.join(outDir, "CrimeHead.csv"),
  toCSV(Object.keys(crimeHeadRows[0]), crimeHeadRows)
);

console.log("Successfully generated all Catalyst CSVs in ./catalyst_csvs/");
