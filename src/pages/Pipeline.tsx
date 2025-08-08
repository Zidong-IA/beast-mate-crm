import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const columns = [
  { id: "cargadas", title: "Fichas cargadas", tone: "accent" },
  { id: "publi", title: "Publi gral influ", tone: "accent" },
  { id: "principal", title: "Principal", tone: "primary" },
  { id: "fake", title: "FAKE/ESTAFA", tone: "destructive" },
  { id: "soporte", title: "SOPORTE", tone: "ring" },
] as const;

const sampleLeads: Record<typeof columns[number]["id"], Array<{ name: string; note: string }>> = {
  cargadas: [
    { name: "0708alexxx", note: "cargado" },
    { name: "Emily723", note: "cargadooo" },
  ],
  publi: [
    { name: "Melany7812", note: "Tu usuario es..." },
    { name: "Samuel7812", note: "Bienvenido a..." },
  ],
  principal: [
    { name: "Isaias78241", note: "Mensaje multi..." },
    { name: "Mary6245", note: "cargadoo" },
  ],
  fake: [
    { name: "adasdasd121", note: "Le pasaste a otra..." },
  ],
  soporte: [
    { name: "pelu1237", note: "Chat cerrado..." },
  ],
};

export default function Pipeline() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold">Pipeline</h1>
        <p className="text-sm text-muted-foreground">Organiza tus conversaciones por etapas.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {columns.map((col) => (
          <Card key={col.id} className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span>{col.title}</span>
                <Badge variant="secondary">{sampleLeads[col.id].length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sampleLeads[col.id].map((lead, i) => (
                <div key={i} className="rounded-lg border bg-card/60 p-3 hover:bg-muted/40 transition">
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{lead.note}</div>
                </div>
              ))}
              <div className="rounded-lg border border-dashed text-muted-foreground text-sm p-3 grid place-items-center">
                + Agregar
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
