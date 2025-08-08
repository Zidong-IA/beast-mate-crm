import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const seed = [
  { name: "Ana Pérez", email: "ana@example.com", status: "Prospecto" },
  { name: "Luis Gómez", email: "luis@example.com", status: "Cliente" },
  { name: "María Ruiz", email: "mruiz@example.com", status: "Prospecto" },
];

export default function Contacts() {
  const [q, setQ] = useState("");
  const data = useMemo(
    () => seed.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()) || r.email.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contactos</h1>
          <p className="text-sm text-muted-foreground">Base de contactos sencilla para empezar.</p>
        </div>
        <Input placeholder="Buscar contactos" value={q} onChange={(e) => setQ(e.target.value)} className="w-64" />
      </div>

      <div className="rounded-md border bg-card card-elevated">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((r) => (
              <TableRow key={r.email}>
                <TableCell>{r.name}</TableCell>
                <TableCell className="text-muted-foreground">{r.email}</TableCell>
                <TableCell className="text-right">{r.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
