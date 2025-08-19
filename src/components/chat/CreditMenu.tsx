import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, CreditCard, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
}

interface CreditMenuProps {
  contactName: string;
  onCreditAdded: (credits: number, pkg?: CreditPackage) => void;
}

const creditPackages: CreditPackage[] = [
  {
    id: "basic",
    name: "Básico",
    credits: 100,
    price: 1000,
    description: "100 fichas - Perfecto para empezar"
  },
  {
    id: "premium",
    name: "Premium", 
    credits: 500,
    price: 4500,
    description: "500 fichas - Mejor valor"
  },
  {
    id: "gold",
    name: "Gold",
    credits: 1000,
    price: 8000,
    description: "1000 fichas - Máximo ahorro"
  }
];

export function CreditMenu({ contactName, onCreditAdded }: CreditMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customCredits, setCustomCredits] = useState("");
  const { toast } = useToast();

  const handlePackageSelect = (pkg: CreditPackage) => {
    onCreditAdded(pkg.credits, pkg);
    setIsOpen(false);
    toast({
      description: `${pkg.credits} fichas cargadas para ${contactName}`
    });
  };

  const handleCustomCredits = () => {
    const credits = parseInt(customCredits);
    if (credits > 0) {
      onCreditAdded(credits);
      setCustomCredits("");
      setIsOpen(false);
      toast({
        description: `${credits} fichas personalizadas cargadas para ${contactName}`
      });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost" className="h-9 w-9" title="Cargar fichas">
          <CreditCard className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="top" align="end">
        <div className="p-4 border-b bg-muted/30">
          <h3 className="font-semibold text-sm">Cargar Fichas</h3>
          <p className="text-xs text-muted-foreground">Para: {contactName}</p>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Paquetes predefinidos */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Paquetes disponibles
            </h4>
            {creditPackages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors border-border/50"
                onClick={() => handlePackageSelect(pkg)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h5 className="font-medium text-sm">{pkg.name}</h5>
                      <p className="text-xs text-muted-foreground">{pkg.description}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      ${pkg.price}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-medium text-primary">
                      {pkg.credits} fichas
                    </span>
                    <Plus className="h-3 w-3 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cantidad personalizada */}
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Cantidad personalizada
            </h4>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Fichas"
                value={customCredits}
                onChange={(e) => setCustomCredits(e.target.value)}
                className="h-8 text-sm"
                min="1"
              />
              <Button 
                size="sm" 
                onClick={handleCustomCredits}
                disabled={!customCredits || parseInt(customCredits) <= 0}
                className="h-8"
              >
                <DollarSign className="h-3 w-3 mr-1" />
                Cargar
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}