import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CASES } from "../src/data/mock.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../catalyst_csvs");

const insertStatements = CASES.map((c) => {
  const crimeNo = c.crimeNo.replace(/'/g, "''");
  const caseNo = c.crimeNo.slice(-9).replace(/'/g, "''");
  const registeredDate = `${c.registeredDate.slice(0, 10)} 10:00:00`;
  const latitude = c.latitude;
  const longitude = c.longitude;
  const briefFacts = c.briefFacts.replace(/'/g, "''");

  return `INSERT INTO CaseMaster (CrimeNo, CaseNo, CrimeRegisteredDate, latitude, longitude, BriefFacts) VALUES ('${crimeNo}', '${caseNo}', '${registeredDate}', ${latitude}, ${longitude}, '${briefFacts}');`;
});

const sqlContent = insertStatements.join("\n");
fs.writeFileSync(path.join(outDir, "insert_casemaster.sql"), sqlContent);

console.log("Generated insert_casemaster.sql with", insertStatements.length, "SQL rows!");
