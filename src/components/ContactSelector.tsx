import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle } from "lucide-react";
import { ChatModal } from "./chat/ChatModal";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  lastMessage?: string;
  status: "connected" | "disconnected";
  platform: "whatsapp" | "instagram" | "facebook" | "webchat";
}

interface ContactSelectorProps {
  children: React.ReactNode;
}

// Mock contacts data
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Juan Pérez",
    phone: "+54 11 1234-5678",
    lastMessage: "¡Hola! Me interesa conocer más...",
    status: "connected",
    platform: "whatsapp"
  },
  {
    id: "2",
    name: "María García",
    phone: "+54 11 2345-6789",
    lastMessage: "Gracias por la información",
    status: "connected",
    platform: "instagram"
  },
  {
    id: "3",
    name: "Carlos López",
    phone: "+54 11 3456-7890",
    lastMessage: "¿Tienen disponibilidad para...?",
    status: "disconnected",
    platform: "facebook"
  },
  {
    id: "4",
    name: "Ana Martínez",
    phone: "+54 11 4567-8901",
    lastMessage: "Perfecto, nos vemos mañana",
    status: "connected",
    platform: "webchat"
  },
  {
    id: "5",
    name: "Luis Rodríguez",
    phone: "+54 11 5678-9012",
    lastMessage: "¿Podrían enviarme el presupuesto?",
    status: "connected",
    platform: "whatsapp"
  }
];

export function ContactSelector({ children }: ContactSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone?.includes(searchTerm)
  );

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setIsOpen(false);
    setIsChatModalOpen(true);
  };

  const getPlatformEmoji = (platform: Contact['platform']) => {
    switch (platform) {
      case "whatsapp":
        return "💬";
      case "instagram":
        return "📷";
      case "facebook":
        return "💙";
      case "webchat":
        return "🌐";
      default:
        return "💬";
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] h-[600px] p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>Seleccionar contacto</DialogTitle>
          </DialogHeader>
          
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 px-6 pb-6">
            <div className="space-y-2">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer border transition-colors"
                  onClick={() => handleContactSelect(contact)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{contact.name}</span>
                      <span className="text-sm">{getPlatformEmoji(contact.platform)}</span>
                      <Badge 
                        variant={contact.status === "connected" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {contact.status === "connected" ? "Conectado" : "Desconectado"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{contact.phone}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {contact.lastMessage}
                    </div>
                  </div>
                  
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {filteredContacts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron contactos
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Chat Modal */}
      {selectedContact && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedContact(null);
          }}
          session={{
            id: `session-${selectedContact.id}`,
            name: selectedContact.name,
            type: selectedContact.platform,
            status: selectedContact.status
          }}
        />
      )}
    </>
  );
}