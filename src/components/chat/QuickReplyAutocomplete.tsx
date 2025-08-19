import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuickReplies, QuickReply } from "@/hooks/useQuickReplies";

interface QuickReplyAutocompleteProps {
  inputValue: string;
  onSelect: (reply: QuickReply) => void;
  isVisible: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function QuickReplyAutocomplete({ 
  inputValue, 
  onSelect, 
  isVisible, 
  inputRef 
}: QuickReplyAutocompleteProps) {
  const { searchReplies } = useQuickReplies();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<QuickReply[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.startsWith('//')) {
      const query = inputValue.slice(2);
      const results = searchReplies(query);
      setSuggestions(results.slice(0, 5)); // Mostrar máximo 5 sugerencias
      setSelectedIndex(0);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, searchReplies]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            onSelect(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setSuggestions([]);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, suggestions, selectedIndex, onSelect]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <Card 
      ref={containerRef}
      className="absolute bottom-full left-0 right-0 mb-2 shadow-lg border bg-background z-50"
    >
      <CardContent className="p-2">
        <div className="text-xs text-muted-foreground mb-2 px-2">
          Respuestas rápidas (↑↓ para navegar, Enter para seleccionar)
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {suggestions.map((reply, index) => (
            <div
              key={reply.id}
              className={`p-2 rounded cursor-pointer transition-colors ${
                index === selectedIndex 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => onSelect(reply)}
            >
              <div className="font-medium text-sm">{reply.name}</div>
              <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {reply.content}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {reply.tags.slice(0, 3).map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="outline" className="text-xs h-4">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}