import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, TrendingUp, Clock, Plus } from "lucide-react";
import { ContactSelector } from "@/components/ContactSelector";

const metrics = [
  { title: "Nuevos prospectos", value: 67, change: -67.48, icon: MessageSquare },
  { title: "Clientes recurrentes", value: 257, change: -58.14, icon: Users },
  { title: "Chats totales", value: 324, change: -60.49, icon: MessageSquare },
  { title: "Tiempo medio de réplica", value: "60s", change: 2.1, icon: Clock },
  { title: "Mensajes", value: 1541, change: -54.89, icon: MessageSquare },
  { title: "Mensajes mandados", value: 1329, change: -53.64, icon: TrendingUp },
  { title: "Mensajes a prospectos", value: 190, change: -63.39, icon: TrendingUp },
  { title: "Mensajes a clientes", value: 1351, change: -53.37, icon: TrendingUp },
];

function StatCard({ title, value, change, icon: Icon }: any) {
  const negative = typeof change === "number" && change < 0;
  return (
    <Card className="card-elevated">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Badge variant="secondary" className="rounded-full"> <Icon className="h-4 w-4" /> </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        <p className={`text-xs mt-1 ${negative ? "text-destructive" : "text-muted-foreground"}`}>
          {typeof change === "number" && (negative ? "↓ " : "↑ ")}
          {typeof change === "number" ? Math.abs(change).toFixed(2) + "%" : ""}
        </p>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Resumen de actividad y métricas clave.</p>
          </div>
          <ContactSelector>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo mensaje
            </Button>
          </ContactSelector>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <StatCard key={m.title} {...m} />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Fuentes de leads</CardTitle>
            <CardDescription>Top canales de adquisición</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 grid place-items-center text-muted-foreground">
              <span>Gráfico (placeholder)</span>
            </div>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Rendimiento por agente</CardTitle>
            <CardDescription>Comparativo simple</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 grid place-items-center text-muted-foreground">
              <span>Gráfico (placeholder)</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
