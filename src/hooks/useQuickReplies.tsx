import { useState, useEffect } from "react";

export interface QuickReply {
  id: string;
  name: string;
  content: string;
  tags: string[];
}

const defaultReplies: QuickReply[] = [
  {
    id: "1",
    name: "Saludo Inicial", 
    content: "¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte hoy?",
    tags: ["saludo", "bienvenida", "hola"]
  },
  {
    id: "2",
    name: "Información de Productos",
    content: "Te envío información sobre nuestros productos. ¿Hay algo específico que te interese?",
    tags: ["productos", "información", "info"]
  },
  {
    id: "3", 
    name: "Precios y Cotización",
    content: "Para brindarte una cotización personalizada, necesito algunos datos. ¿Podrías contarme más sobre lo que buscas?",
    tags: ["precios", "cotización", "precio"]
  },
  {
    id: "4",
    name: "Horarios de Atención", 
    content: "Nuestro horario de atención es de Lunes a Viernes de 9:00 AM a 6:00 PM. ¿En qué podemos ayudarte?",
    tags: ["horarios", "disponibilidad", "atencion"]
  },
  {
    id: "5",
    name: "Seguimiento",
    content: "Quería hacer seguimiento de nuestra conversación anterior. ¿Ya pudiste revisar la propuesta que te envié?",
    tags: ["seguimiento", "propuesta", "revision"]
  },
  {
    id: "6",
    name: "Gracias por el pago",
    content: "¡Perfecto! He recibido tu comprobante de pago. Procedo a cargar las fichas en tu cuenta.",
    tags: ["pago", "fichas", "comprobante", "gracias"]
  }
];

export function useQuickReplies() {
  const [replies, setReplies] = useState<QuickReply[]>(defaultReplies);

  const searchReplies = (query: string): QuickReply[] => {
    if (!query) return [];
    
    const searchTerm = query.toLowerCase();
    return replies.filter(reply => 
      reply.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      reply.name.toLowerCase().includes(searchTerm)
    );
  };

  return {
    replies,
    searchReplies
  };
}