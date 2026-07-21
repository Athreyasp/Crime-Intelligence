import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CASES, DISTRICTS, CRIME_HEADS } from "../src/data/mock.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../catalyst_csvs");

// 1. ComplainantDetails SQL
let complainantIdCounter = 1;
const complainantValues = CASES.map((c) => {
  const id = complainantIdCounter++;
  const name = c.complainant.name.replace(/'/g, "''");
  const age = c.complainant.age;
  const gender = c.complainant.gender === "M" ? 1 : 2;
  return `('${name}', ${age}, ${gender})`;
});
const complainantSql = `INSERT INTO ComplainantDetails (ComplainantName, AgeYear, GenderID) VALUES\n` + complainantValues.join(",\n") + `;`;
fs.writeFileSync(path.join(outDir, "insert_complainant_details.sql"), complainantSql);

// 2. Victim SQL
let victimIdCounter = 1;
const victimValues = CASES.flatMap((c) =>
  c.victims.map((v) => {
    const name = v.name.replace(/'/g, "''");
    const age = v.age;
    const gender = v.gender === "M" ? 1 : 2;
    return `('${name}', ${age}, ${gender})`;
  })
);
const victimSql = `INSERT INTO Victim (VictimName, AgeYear, GenderID) VALUES\n` + victimValues.join(",\n") + `;`;
fs.writeFileSync(path.join(outDir, "insert_victim.sql"), victimSql);

// 3. Accused SQL
let accusedIdCounter = 1;
const accusedValues = CASES.flatMap((c) =>
  c.accused.map((a) => {
    const name = a.name.replace(/'/g, "''");
    const age = a.age;
    const gender = a.gender === "M" ? 1 : 2;
    const personId = a.id.replace(/'/g, "''");
    return `('${name}', ${age}, ${gender}, '${personId}')`;
  })
);
const accusedSql = `INSERT INTO Accused (AccusedName, AgeYear, GenderID, PersonID) VALUES\n` + accusedValues.join(",\n") + `;`;
fs.writeFileSync(path.join(outDir, "insert_accused.sql"), accusedSql);

// 4. District SQL
const districtValues = DISTRICTS.map((d) => {
  const name = d.name.replace(/'/g, "''");
  return `('${name}')`;
});
const districtSql = `INSERT INTO District (DistrictName) VALUES\n` + districtValues.join(",\n") + `;`;
fs.writeFileSync(path.join(outDir, "insert_district.sql"), districtSql);

// 5. CrimeHead SQL
const crimeHeadValues = CRIME_HEADS.map((ch) => {
  const name = ch.name.replace(/'/g, "''");
  return `('${name}')`;
});
const crimeHeadSql = `INSERT INTO CrimeHead (CrimeGroupName) VALUES\n` + crimeHeadValues.join(",\n") + `;`;
fs.writeFileSync(path.join(outDir, "insert_crimehead.sql"), crimeHeadSql);

console.log("Successfully generated SQL insert files for ComplainantDetails, Victim, Accused, District, CrimeHead!");
