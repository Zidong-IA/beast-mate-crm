import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Users, Clock, Play, Pause, Square, FileText, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  name: string;
  message: string;
  contacts: string[];
  status: "draft" | "sending" | "paused" | "completed" | "failed";
  sent: number;
  total: number;
  intervalMin: number;
  intervalMax: number;
  created_at?: string;
  scheduled_at?: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  tags: string[];
}

const mockContacts: Contact[] = [
  { id: "1", name: "Juan Pérez", phone: "+54 11 1234-5678", tags: ["cliente", "premium"] },
  { id: "2", name: "María García", phone: "+54 11 8765-4321", tags: ["prospecto", "interesado"] },
  { id: "3", name: "Carlos López", phone: "+54 11 5555-1234", tags: ["cliente", "regular"] },
  { id: "4", name: "Ana Martínez", phone: "+54 11 9999-8888", tags: ["prospecto", "nuevo"] },
  { id: "5", name: "Luis Rodríguez", phone: "+54 11 7777-6666", tags: ["cliente", "vip"] }
];

export default function MassMessaging() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    intervalMin: "5",
    intervalMax: "15"
  });
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Mensajería Masiva – BeastCRM Clone";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedContacts.length === 0) {
      toast({ 
        variant: "destructive",
        description: "Debes seleccionar al menos un contacto" 
      });
      return;
    }

    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: formData.name,
      message: formData.message,
      contacts: selectedContacts,
      status: "draft",
      sent: 0,
      total: selectedContacts.length,
      intervalMin: parseInt(formData.intervalMin),
      intervalMax: parseInt(formData.intervalMax),
      created_at: new Date().toISOString()
    };

    setCampaigns(prev => [...prev, newCampaign]);
    toast({ description: "Campaña creada correctamente" });
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", message: "", intervalMin: "5", intervalMax: "15" });
    setSelectedContacts([]);
    setIsDialogOpen(false);
  };

  const startCampaign = (id: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === id ? { ...campaign, status: "sending" } : campaign
    ));
    
    // Simular envío de mensajes con progreso
    simulateSending(id);
    toast({ description: "Campaña iniciada" });
  };

  const pauseCampaign = (id: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === id ? { ...campaign, status: "paused" } : campaign
    ));
    toast({ description: "Campaña pausada" });
  };

  const stopCampaign = (id: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === id ? { ...campaign, status: "completed" } : campaign
    ));
    toast({ description: "Campaña detenida" });
  };

  const simulateSending = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    const interval = setInterval(() => {
      setCampaigns(prev => prev.map(c => {
        if (c.id === campaignId && c.status === "sending") {
          const newSent = Math.min(c.sent + 1, c.total);
          const newStatus = newSent >= c.total ? "completed" : "sending";
          return { ...c, sent: newSent, status: newStatus };
        }
        return c;
      }));
    }, 2000);

    setTimeout(() => clearInterval(interval), campaign.total * 2000);
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case "draft": return "bg-muted-foreground";
      case "sending": return "bg-primary";
      case "paused": return "bg-accent";
      case "completed": return "bg-primary";
      case "failed": return "bg-destructive";
      default: return "bg-muted-foreground";
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case "draft": return "Borrador";
      case "sending": return "Enviando";
      case "paused": return "Pausada";
      case "completed": return "Completada";
      case "failed": return "Fallida";
      default: return "Desconocido";
    }
  };

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    setSelectedContacts(
      selectedContacts.length === mockContacts.length 
        ? [] 
        : mockContacts.map(c => c.id)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Mensajería Masiva</h1>
          <p className="text-muted-foreground">Envía mensajes a múltiples contactos con intervalos aleatorios</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Send className="h-4 w-4" />
              Nueva Campaña
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nueva Campaña Masiva</DialogTitle>
              <DialogDescription>
                Crea una campaña para enviar mensajes a múltiples contactos
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="message" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="message">Mensaje</TabsTrigger>
                <TabsTrigger value="contacts">Contactos</TabsTrigger>
                <TabsTrigger value="settings">Configuración</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSubmit}>
                <TabsContent value="message" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre de la Campaña</Label>
                    <Input
                      id="name"
                      placeholder="Ej: Promoción Navideña"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      placeholder="Escribe tu mensaje aquí..."
                      className="min-h-[150px]"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Puedes usar variables como {"{nombre}"} para personalizar el mensaje
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="contacts" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Seleccionar Contactos ({selectedContacts.length}/{mockContacts.length})</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleSelectAll}>
                      {selectedContacts.length === mockContacts.length ? "Deseleccionar Todo" : "Seleccionar Todo"}
                    </Button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto border rounded-md p-2 space-y-2">
                    {mockContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                          selectedContacts.includes(contact.id)
                            ? "bg-primary/10 border border-primary/20"
                            : "bg-muted/30 hover:bg-muted/50"
                        }`}
                        onClick={() => handleContactToggle(contact.id)}
                      >
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        </div>
                        <div className="flex space-x-1">
                          {contact.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="intervalMin">Intervalo Mínimo (segundos)</Label>
                      <Input
                        id="intervalMin"
                        type="number"
                        min="1"
                        value={formData.intervalMin}
                        onChange={(e) => setFormData(prev => ({ ...prev, intervalMin: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="intervalMax">Intervalo Máximo (segundos)</Label>
                      <Input
                        id="intervalMax"
                        type="number"
                        min="1"
                        value={formData.intervalMax}
                        onChange={(e) => setFormData(prev => ({ ...prev, intervalMax: e.target.value }))}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Los mensajes se enviarán con un intervalo aleatorio entre estos valores para evitar ser detectados como spam
                  </p>
                </TabsContent>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear Campaña</Button>
                </div>
              </form>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {campaigns.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Send className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No hay campañas creadas</p>
              <p className="text-muted-foreground text-center mb-4">
                Crea tu primera campaña de mensajería masiva para comenzar
              </p>
            </CardContent>
          </Card>
        ) : (
          campaigns.map((campaign) => (
            <Card key={campaign.id} className="card-elevated">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{campaign.name}</span>
                      <Badge className={getStatusColor(campaign.status)}>
                        {getStatusText(campaign.status)}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {campaign.total} contactos • Intervalo: {campaign.intervalMin}-{campaign.intervalMax}s
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {campaign.status === "draft" && (
                      <Button size="sm" onClick={() => startCampaign(campaign.id)}>
                        <Play className="h-3 w-3" />
                        Iniciar
                      </Button>
                    )}
                    {campaign.status === "sending" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => pauseCampaign(campaign.id)}>
                          <Pause className="h-3 w-3" />
                          Pausar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => stopCampaign(campaign.id)}>
                          <Square className="h-3 w-3" />
                          Detener
                        </Button>
                      </>
                    )}
                    {campaign.status === "paused" && (
                      <Button size="sm" onClick={() => startCampaign(campaign.id)}>
                        <Play className="h-3 w-3" />
                        Reanudar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Mensaje:</p>
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                      {campaign.message}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Progreso: {campaign.sent}/{campaign.total}</span>
                    <span>{Math.round((campaign.sent / campaign.total) * 100)}%</span>
                  </div>
                  <Progress value={(campaign.sent / campaign.total) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}