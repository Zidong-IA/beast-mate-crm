import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuickReply {
  id: string;
  name: string;
  content: string;
  tags: string[];
  created_at?: string;
}

const defaultReplies: QuickReply[] = [
  {
    id: "1",
    name: "Saludo Inicial",
    content: "¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte hoy?",
    tags: ["saludo", "bienvenida"]
  },
  {
    id: "2", 
    name: "Información de Productos",
    content: "Te envío información sobre nuestros productos. ¿Hay algo específico que te interese?",
    tags: ["productos", "información"]
  },
  {
    id: "3",
    name: "Precios y Cotización",
    content: "Para brindarte una cotización personalizada, necesito algunos datos. ¿Podrías contarme más sobre lo que buscas?",
    tags: ["precios", "cotización"]
  },
  {
    id: "4",
    name: "Horarios de Atención",
    content: "Nuestro horario de atención es de Lunes a Viernes de 9:00 AM a 6:00 PM. ¿En qué podemos ayudarte?",
    tags: ["horarios", "disponibilidad"]
  },
  {
    id: "5",
    name: "Seguimiento",
    content: "Quería hacer seguimiento de nuestra conversación anterior. ¿Ya pudiste revisar la propuesta que te envié?",
    tags: ["seguimiento", "propuesta"]
  }
];

export default function QuickReplies() {
  const [replies, setReplies] = useState<QuickReply[]>(defaultReplies);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReply, setEditingReply] = useState<QuickReply | null>(null);
  const [formData, setFormData] = useState({ name: "", content: "", tags: "" });
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Respuestas Rápidas – BeastCRM Clone";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReply: QuickReply = {
      id: editingReply?.id || Date.now().toString(),
      name: formData.name,
      content: formData.content,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      created_at: new Date().toISOString()
    };

    if (editingReply) {
      setReplies(prev => prev.map(reply => 
        reply.id === editingReply.id ? newReply : reply
      ));
      toast({ description: "Respuesta rápida actualizada correctamente" });
    } else {
      setReplies(prev => [...prev, newReply]);
      toast({ description: "Respuesta rápida creada correctamente" });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", content: "", tags: "" });
    setEditingReply(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (reply: QuickReply) => {
    setEditingReply(reply);
    setFormData({
      name: reply.name,
      content: reply.content,
      tags: reply.tags.join(', ')
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setReplies(prev => prev.filter(reply => reply.id !== id));
    toast({ description: "Respuesta rápida eliminada" });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ description: "Contenido copiado al portapapeles" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Respuestas Rápidas</h1>
          <p className="text-muted-foreground">Gestiona las respuestas predefinidas para agilizar las conversaciones</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" onClick={() => setEditingReply(null)}>
              <Plus className="h-4 w-4" />
              Nueva Respuesta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingReply ? "Editar Respuesta Rápida" : "Nueva Respuesta Rápida"}
              </DialogTitle>
              <DialogDescription>
                Crea respuestas predefinidas para usar en tus conversaciones
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Ej: Saludo inicial"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Contenido del Mensaje</Label>
                <Textarea
                  id="content"
                  placeholder="Escribe aquí el contenido de la respuesta..."
                  className="min-h-[100px]"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
                <Input
                  id="tags"
                  placeholder="Ej: saludo, bienvenida, inicial"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingReply ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {replies.map((reply) => (
          <Card key={reply.id} className="card-elevated">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{reply.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => copyToClipboard(reply.content)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => handleEdit(reply)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(reply.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                {reply.content}
              </p>
              <div className="flex flex-wrap gap-1">
                {reply.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}