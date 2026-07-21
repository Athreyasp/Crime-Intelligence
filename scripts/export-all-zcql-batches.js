import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CASES } from "../src/data/mock.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../catalyst_csvs");

const batchSize = 60;
for (let i = 0; i < CASES.length; i += batchSize) {
  const batchCases = CASES.slice(i, i + batchSize);
  const batchNum = Math.floor(i / batchSize) + 1;

  const valuesList = batchCases.map((c) => {
    const crimeNo = c.crimeNo.replace(/'/g, "''");
    const caseNo = c.crimeNo.slice(-9).replace(/'/g, "''");
    const registeredDate = `${c.registeredDate.slice(0, 10)} 10:00:00`;
    const latitude = Number(c.latitude.toFixed(4));
    const longitude = Number(c.longitude.toFixed(4));
    const briefFacts = c.briefFacts.replace(/'/g, "''");

    return `('${crimeNo}', '${caseNo}', '${registeredDate}', ${latitude}, ${longitude}, '${briefFacts}')`;
  });

  const sqlContent =
    `INSERT INTO CaseMaster (CrimeNo, CaseNo, CrimeRegisteredDate, latitude, longitude, BriefFacts) VALUES\n` +
    valuesList.join(",\n") +
    `;`;

  fs.writeFileSync(
    path.join(outDir, `casemaster_batch_${batchNum}.sql`),
    sqlContent
  );
  console.log(`Generated casemaster_batch_${batchNum}.sql (${batchCases.length} rows)`);
}
