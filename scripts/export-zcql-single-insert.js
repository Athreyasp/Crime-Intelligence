import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CASES } from "../src/data/mock.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../catalyst_csvs");

// Limit to 20 rows per batch for clean ZCQL execution
const sampleCases = CASES.slice(0, 20);

const valuesList = sampleCases.map((c) => {
  const crimeNo = c.crimeNo.replace(/'/g, "''");
  const caseNo = c.crimeNo.slice(-9).replace(/'/g, "''");
  const registeredDate = `${c.registeredDate.slice(0, 10)} 10:00:00`;
  const latitude = Number(c.latitude.toFixed(4));
  const longitude = Number(c.longitude.toFixed(4));
  const briefFacts = c.briefFacts.replace(/'/g, "''");

  return `('${crimeNo}', '${caseNo}', '${registeredDate}', ${latitude}, ${longitude}, '${briefFacts}')`;
});

const sqlContent = `INSERT INTO CaseMaster (CrimeNo, CaseNo, CrimeRegisteredDate, latitude, longitude, BriefFacts) VALUES\n` + valuesList.join(",\n") + `;`;

fs.writeFileSync(path.join(outDir, "single_insert_casemaster.sql"), sqlContent);

console.log("Generated single_insert_casemaster.sql!");
