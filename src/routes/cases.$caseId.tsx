import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CASES } from "@/data/mock";
import { ArrowLeft, MapPin, Calendar, Gavel, User, Users, Shield } from "lucide-react";

export const Route = createFileRoute("/cases/$caseId")({
  head: ({ params }: { params: { caseId: string } }) => ({
    meta: [
      { title: `FIR ${params.caseId} · KSP Crime Intelligence` },
      { name: "description", content: `Full FIR breakdown for case ${params.caseId} — complainant, victims, accused, acts and sections.` },
    ],
  }),
  loader: ({ params }: { params: { caseId: string } }) => {
    const c = CASES.find(x => x.caseMasterId === Number(params.caseId));
    if (!c) throw notFound();
    return { case: c };
  },
  component: CaseDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-16 text-center">
      <h2 className="font-display text-2xl">Case not found</h2>
      <Link to="/cases" className="mt-4 inline-block text-primary hover:underline">← Back to explorer</Link>
    </div>
  ),
});

function CaseDetail() {
  const { caseId } = Route.useParams();
  const c = CASES.find(x => x.caseMasterId === Number(caseId)) || CASES[0];
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <Link to="/cases" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Back to explorer
      </Link>
      <header className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <Shield className="h-3 w-3 text-signal" />
          <span>Karnataka State Police · FIR Record</span>
          <span className="ml-auto hidden font-mono text-signal sm:inline">Restricted · FOUO</span>
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-signal">
          § 07 · {c.category} · <span className="text-muted-foreground">{c.crimeNo}</span>
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold md:text-3xl">{c.crimeHead.name}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge className={c.gravity === "Heinous" ? "bg-alert text-alert-foreground" : "bg-secondary"}>{c.gravity}</Badge>
          <Badge variant="outline">{c.status}</Badge>
          <Badge variant="outline"><MapPin className="mr-1 h-3 w-3" />{c.district.name}</Badge>
          <Badge variant="outline"><Calendar className="mr-1 h-3 w-3" />{new Date(c.registeredDate).toLocaleDateString("en-IN")}</Badge>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-surface-1 border-border">
          <CardHeader className="pb-2"><CardTitle className="text-base">Brief Facts</CardTitle></CardHeader>
          <CardContent><p className="text-sm leading-relaxed text-muted-foreground">{c.briefFacts}</p></CardContent>
        </Card>

        <Card className="bg-surface-1 border-border">
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Gavel className="h-4 w-4" /> Acts & Sections</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {c.actSections.map((a: string, i: number) => (
              <div key={i} className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm font-mono">{a}</div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="bg-surface-1 border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><User className="h-4 w-4" /> Complainant</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{c.complainant.name}</p>
            <p className="text-xs text-muted-foreground">Age {c.complainant.age} · {c.complainant.gender === "M" ? "Male" : "Female"}</p>
            <p className="text-xs text-muted-foreground">Occupation: {c.complainant.occupation}</p>
          </CardContent>
        </Card>

        <Card className="bg-surface-1 border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4" /> Victims ({c.victims.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {c.victims.map((v: typeof c.victims[number], i: number) => (
              <div key={i} className="text-sm">
                <p className="font-medium">{v.name}</p>
                <p className="text-xs text-muted-foreground">Age {v.age} · {v.gender === "M" ? "Male" : "Female"}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-surface-1 border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4" /> Accused ({c.accused.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {c.accused.map((a: typeof c.accused[number]) => (
              <div key={a.id} className="flex items-center justify-between text-sm rounded-md border border-border bg-surface-2 p-2">
                <div>
                  <p className="font-medium">{a.id} · {a.name}</p>
                  <p className="text-[11px] text-muted-foreground">Age {a.age} · {a.gender}</p>
                </div>
                {a.arrestId ? (
                  <Badge className="bg-success/20 text-success border border-success/40">Arrested</Badge>
                ) : (
                  <Badge variant="outline" className="border-warning/40 text-warning">At large</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-surface-1 border-border">
        <CardHeader className="pb-2"><CardTitle className="text-base">Incident Location</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4 text-sm">
            <Info label="Police Station" value={c.policeStation} />
            <Info label="District" value={c.district.name} />
            <Info label="Latitude" value={c.latitude.toFixed(4)} mono />
            <Info label="Longitude" value={c.longitude.toFixed(4)} mono />
            <Info label="Incident from" value={new Date(c.incidentDate).toLocaleString("en-IN")} />
            <Info label="Registered" value={new Date(c.registeredDate).toLocaleString("en-IN")} />
            <Info label="MO Tag" value={c.moTag} />
            <Info label="Hour of Incident" value={`${String(c.hour).padStart(2, "0")}:00`} mono />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-surface-2 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 text-sm ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
