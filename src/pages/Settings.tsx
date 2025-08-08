import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

const spaces = [
  { name: "Fichas cargadas", color: "accent" },
  { name: "Publi gral influ", color: "accent" },
  { name: "Principal", color: "primary" },
  { name: "FAKE/ESTAFA", color: "destructive" },
  { name: "SOPORTE", color: "ring" },
];

export default function Settings() {
  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Configuración</h1>
          <p className="text-sm text-muted-foreground">Crea, edita y elimina tus espacios de trabajo.</p>
        </div>
        <Button variant="hero" size="sm"><Plus className="h-4 w-4" />Agregar</Button>
      </section>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Espacios de trabajo</CardTitle>
          <CardDescription>Gestiona tus columnas del pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
            {spaces.map((s) => (
              <div key={s.name} className="rounded-xl border bg-card/70 p-4">
                <div className="text-sm font-medium mb-3">{s.name}</div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm"><Pencil className="h-4 w-4" />Editar</Button>
                  <Button variant="outline" size="sm"><Trash2 className="h-4 w-4" />Eliminar</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
