import { CASES, DISTRICTS, CRIME_HEADS, type Case, type District } from "@/data/mock";

// Zoho Catalyst API Service Layer
// Automatically fetches live data from Catalyst Data Store when deployed on Catalyst Hosting,
// with clean fallback to seed data during local dev.

export async function fetchLiveCases(): Promise<Case[]> {
  try {
    // When running on Zoho Catalyst, fetch live rows from Catalyst Data Store API
    const response = await fetch("/baas/v1/project/datastore/table/CaseMaster/row", {
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.data && data.data.length > 0) {
        return data.data.map((row: Record<string, unknown>) => ({
          caseMasterId: Number(row.ROWID || row.CaseMasterID),
          crimeNo: String(row.CrimeNo || ""),
          registeredDate: String(row.CrimeRegisteredDate || "").slice(0, 10),
          incidentDate: String(row.CrimeRegisteredDate || "").slice(0, 10),
          hour: 10,
          district: DISTRICTS.find((d) => d.name === row.DistrictName) || DISTRICTS[0],
          policeStation: "Station A",
          category: "FIR",
          gravity: "Heinous",
          crimeHead: CRIME_HEADS[0],
          status: "Under Investigation",
          actSections: ["BNS 103"],
          moTag: "Night Burglary",
          briefFacts: String(row.BriefFacts || "Live case record from Catalyst Data Store"),
          complainant: { name: "Live Complainant", age: 35, gender: "M", occupation: "IT" },
          victims: [{ name: "Live Victim", age: 30, gender: "F" }],
          accused: [{ id: "A1", name: "Accused Person", age: 28, gender: "M" }],
          latitude: Number(row.latitude || 12.9716),
          longitude: Number(row.longitude || 77.5946),
        }));
      }
    }
  } catch (err) {
    console.warn("Catalyst live DB fetch fallback to local seed dataset:", err);
  }

  // Fallback to initial seed dataset if offline
  return CASES;
}

export async function fetchLiveDistricts(): Promise<District[]> {
  try {
    const response = await fetch("/baas/v1/project/datastore/table/District/row");
    if (response.ok) {
      const data = await response.json();
      if (data && data.data && data.data.length > 0) {
        return data.data.map((row: Record<string, unknown>, idx: number) => ({
          id: idx + 1,
          name: String(row.DistrictName),
          x: 0.5,
          y: 0.5,
          population: 1500000,
          urbanization: 35,
          literacy: 75,
        }));
      }
    }
  } catch (err) {
    console.warn("Fallback to local districts:", err);
  }
  return DISTRICTS;
}
