import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, Smile, MoreVertical, Phone, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Session {
  id: string;
  name: string;
  type: "whatsapp" | "evolution" | "instagram" | "facebook" | "webchat";
  status: "connected" | "disconnected" | "error";
  phone?: string;
}

interface Message {
  id: string;
  content: string;
  type: "text" | "image" | "file";
  direction: "sent" | "received";
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  lastSeen?: Date;
  isOnline: boolean;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}

// Mock data
const mockContact: Contact = {
  id: "1",
  name: "Juan Pérez",
  avatar: "",
  phone: "+54 11 1234-5678",
  lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  isOnline: true
};

const mockMessages: Message[] = [
  {
    id: "1",
    content: "¡Hola! Me interesa conocer más sobre sus productos.",
    type: "text",
    direction: "received",
    timestamp: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: "2", 
    content: "¡Hola Juan! Gracias por contactarnos. Te envío información sobre nuestros productos principales.",
    type: "text",
    direction: "sent",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    status: "read"
  },
  {
    id: "3",
    content: "¿Podrían enviarme una cotización personalizada?",
    type: "text", 
    direction: "received",
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: "4",
    content: "Por supuesto. Para brindarte una cotización precisa, necesito algunos datos sobre lo que buscas específicamente.",
    type: "text",
    direction: "sent", 
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    status: "delivered"
  }
];

export function ChatModal({ isOpen, onClose, session }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      type: "text",
      direction: "sent",
      timestamp: new Date(),
      status: "sent"
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
    toast({ description: "Mensaje enviado" });

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: "delivered" } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: "read" } : msg
      ));
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case "sent":
        return "✓";
      case "delivered": 
        return "✓✓";
      case "read":
        return <span className="text-primary">✓✓</span>;
      default:
        return "";
    }
  };

  const getSessionIcon = () => {
    switch (session.type) {
      case "whatsapp":
      case "evolution":
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] h-[600px] p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={mockContact.avatar} />
                <AvatarFallback>{mockContact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="flex items-center space-x-2">
                  <span>{mockContact.name}</span>
                  <span className="text-sm">{getSessionIcon()}</span>
                </DialogTitle>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <div className={`h-2 w-2 rounded-full ${mockContact.isOnline ? 'bg-primary' : 'bg-muted-foreground'}`} />
                  <span>
                    {mockContact.isOnline 
                      ? "En línea" 
                      : `Visto por última vez ${formatTime(mockContact.lastSeen!)}`
                    }
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {session.name}
              </Badge>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Video className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.direction === "sent" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-2 ${
                    message.direction === "sent"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className={`flex items-center justify-end space-x-1 mt-1 text-xs ${
                    message.direction === "sent" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {message.direction === "sent" && (
                      <span className="ml-1">{getStatusIcon(message.status)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2 max-w-[70%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-background">
          <div className="flex items-center space-x-2">
            <Button size="icon" variant="ghost" className="h-9 w-9">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <Input
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-0 focus-visible:ring-1"
              />
            </div>
            <Button size="icon" variant="ghost" className="h-9 w-9">
              <Smile className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="h-9 w-9"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}