import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, MessageSquare, Instagram, Facebook, Globe, Settings, Trash2, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChatModal } from "@/components/chat/ChatModal";

interface Session {
  id: string;
  name: string;
  type: "whatsapp" | "evolution" | "instagram" | "facebook" | "webchat";
  status: "connected" | "disconnected" | "error";
  phone?: string;
  webhook?: string;
  apiKey?: string;
  created_at?: string;
}

const sessionTypes = [
  { value: "whatsapp", label: "WhatsApp Business API", icon: MessageSquare },
  { value: "evolution", label: "Evolution API", icon: MessageCircle },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "facebook", label: "Facebook Messenger", icon: Facebook },
  { value: "webchat", label: "WebChat", icon: Globe }
];

const defaultSessions: Session[] = [
  {
    id: "1",
    name: "WhatsApp Principal",
    type: "whatsapp",
    status: "connected",
    phone: "+54 11 1234-5678"
  },
  {
    id: "2",
    name: "Instagram Comercial",
    type: "instagram", 
    status: "disconnected"
  },
  {
    id: "3",
    name: "Web Chat Sitio",
    type: "webchat",
    status: "connected"
  }
];

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>(defaultSessions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    phone: "",
    webhook: "",
    apiKey: ""
  });
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Sesiones – BeastCRM Clone";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSession: Session = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type as Session['type'],
      status: "disconnected",
      phone: formData.phone || undefined,
      webhook: formData.webhook || undefined,
      apiKey: formData.apiKey || undefined,
      created_at: new Date().toISOString()
    };

    setSessions(prev => [...prev, newSession]);
    toast({ description: "Sesión creada correctamente" });
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", type: "", phone: "", webhook: "", apiKey: "" });
    setIsDialogOpen(false);
  };

  const toggleStatus = (id: string) => {
    setSessions(prev => prev.map(session => ({
      ...session,
      status: session.id === id 
        ? (session.status === "connected" ? "disconnected" : "connected")
        : session.status
    } as Session)));

    const session = sessions.find(s => s.id === id);
    const newStatus = session?.status === "connected" ? "desconectada" : "conectada";
    toast({ description: `Sesión ${newStatus}` });
  };

  const handleDelete = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
    toast({ description: "Sesión eliminada" });
  };

  const openChat = (session: Session) => {
    setSelectedSession(session);
    setChatModalOpen(true);
  };

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case "connected": return "bg-primary";
      case "disconnected": return "bg-muted-foreground";
      case "error": return "bg-destructive";
      default: return "bg-muted-foreground";
    }
  };

  const getStatusText = (status: Session['status']) => {
    switch (status) {
      case "connected": return "Conectado";
      case "disconnected": return "Desconectado";
      case "error": return "Error";
      default: return "Desconocido";
    }
  };

  const getTypeIcon = (type: Session['type']) => {
    const sessionType = sessionTypes.find(t => t.value === type);
    const Icon = sessionType?.icon || MessageSquare;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Sesiones de Mensajería</h1>
            <p className="text-muted-foreground">Gestiona las conexiones a diferentes plataformas de mensajería</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="h-4 w-4" />
                Nueva Sesión
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Nueva Sesión de Mensajería</DialogTitle>
                <DialogDescription>
                  Conecta una nueva plataforma de mensajería
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Sesión</Label>
                  <Input
                    id="name"
                    placeholder="Ej: WhatsApp Principal"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Plataforma</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <type.icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(formData.type === "whatsapp" || formData.type === "evolution") && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Número de Teléfono</Label>
                    <Input
                      id="phone"
                      placeholder="+54 11 1234-5678"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="webhook">Webhook URL</Label>
                  <Input
                    id="webhook"
                    placeholder="https://tu-webhook.com/endpoint"
                    value={formData.webhook}
                    onChange={(e) => setFormData(prev => ({ ...prev, webhook: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Tu clave de API"
                    value={formData.apiKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear Sesión</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Card key={session.id} className="card-elevated">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(session.type)}
                    <CardTitle className="text-base">{session.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(session.status)}`} />
                    <span className="text-xs text-muted-foreground">
                      {getStatusText(session.status)}
                    </span>
                  </div>
                </div>
                <CardDescription>
                  {sessionTypes.find(t => t.value === session.type)?.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.phone && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Teléfono: </span>
                      <span>{session.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`status-${session.id}`} className="text-sm">Estado</Label>
                    <Switch
                      id={`status-${session.id}`}
                      checked={session.status === "connected"}
                      onCheckedChange={() => toggleStatus(session.id)}
                    />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => openChat(session)}
                      disabled={session.status !== "connected"}
                    >
                      <MessageCircle className="h-3 w-3" />
                      Chat
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(session.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedSession && (
        <ChatModal
          isOpen={chatModalOpen}
          onClose={() => {
            setChatModalOpen(false);
            setSelectedSession(null);
          }}
          contact={{
            id: "mock-contact",
            name: "Cliente de " + selectedSession.name,
            phone: selectedSession.phone || "+54 11 1234-5678",
            lastSeen: new Date(Date.now() - 5 * 60 * 1000),
            isOnline: selectedSession.status === "connected"
          }}
          availableSessions={[selectedSession]}
        />
      )}
    </>
  );
}