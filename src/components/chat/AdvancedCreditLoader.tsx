import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  CreditCard, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  Receipt, 
  User, 
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfiles, UserProfile } from "@/hooks/useUserProfiles";

interface AdvancedCreditLoaderProps {
  isOpen: boolean;
  onClose: () => void;
  client: UserProfile;
  onCreditLoaded: (amount: number, transaction: any) => void;
}

const predefinedPackages = [
  { id: 'basic', name: 'Básico', amount: 100, price: 1000, color: 'bg-blue-500' },
  { id: 'premium', name: 'Premium', amount: 500, price: 4500, color: 'bg-purple-500' },
  { id: 'gold', name: 'Gold', amount: 1000, price: 8000, color: 'bg-yellow-500' },
  { id: 'enterprise', name: 'Enterprise', amount: 2500, price: 18000, color: 'bg-green-500' }
];

export function AdvancedCreditLoader({ 
  isOpen, 
  onClose, 
  client, 
  onCreditLoaded 
}: AdvancedCreditLoaderProps) {
  const [customAmount, setCustomAmount] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProfileExpanded, setIsProfileExpanded] = useState(true);
  const [isBalanceExpanded, setIsBalanceExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { profile, createCreditTransaction } = useUserProfiles();

  const handlePackageSelect = (pkg: typeof predefinedPackages[0]) => {
    setSelectedPackage(pkg.id);
    setCustomAmount(pkg.amount.toString());
  };

  const handleCreditLoad = async () => {
    const amount = parseFloat(customAmount);
    
    if (!amount || amount <= 0) {
      toast({
        variant: "destructive",
        description: "Por favor ingresa un monto válido"
      });
      return;
    }

    if (!receiptNumber.trim()) {
      toast({
        variant: "destructive", 
        description: "Por favor ingresa el número de comprobante"
      });
      return;
    }

    setLoading(true);
    
    try {
      const transaction = await createCreditTransaction(
        client.id,
        amount,
        'load',
        receiptNumber,
        notes
      );

      onCreditLoaded(amount, transaction);
      
      toast({
        description: `✅ ${amount} fichas cargadas exitosamente a ${client.name}`
      });
      
      // Reset form
      setCustomAmount("");
      setReceiptNumber("");
      setNotes("");
      setSelectedPackage(null);
      onClose();
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Error al cargar fichas: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-3 border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-4 w-4 text-primary" />
            Cargar Fichas
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Client Profile Section */}
            <Collapsible open={isProfileExpanded} onOpenChange={setIsProfileExpanded}>
              <CollapsibleTrigger asChild>
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={client.avatar_url} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                            {client.name?.split(' ').map(n => n[0]).join('') || 'CL'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-sm">{client.name || 'Cliente'}</h3>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              ID: {client.id.slice(-6)}
                            </Badge>
                            <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="text-xs px-1 py-0">
                              {client.status === 'active' ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {isProfileExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="p-3 pt-0">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Email:</span>
                          </div>
                          <span className="font-medium text-xs">{client.email || 'No disponible'}</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Miembro desde:</span>
                          </div>
                          <span className="font-medium text-xs">
                            {new Date(client.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {client.phone && (
                            <>
                              <span className="text-muted-foreground">Teléfono:</span>
                              <span className="font-medium text-xs block">{client.phone}</span>
                            </>
                          )}
                          {client.google_contact_id && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span className="text-green-600 font-medium text-xs">Google Contacts</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </CollapsibleTrigger>
            </Collapsible>

            {/* Balance Information */}
            <Collapsible open={isBalanceExpanded} onOpenChange={setIsBalanceExpanded}>
              <CollapsibleTrigger asChild>
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Wallet className="h-4 w-4 text-primary" />
                        Balance Actual
                      </CardTitle>
                      {isBalanceExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="p-3 pt-0">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-primary/10 rounded-lg">
                          <DollarSign className="h-5 w-5 text-primary mx-auto mb-1" />
                          <div className="text-lg font-bold text-primary">
                            {client.balance.toFixed(0)}
                          </div>
                          <div className="text-xs text-muted-foreground">Disponibles</div>
                        </div>
                        
                        <div className="text-center p-2 bg-accent/10 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-accent mx-auto mb-1" />
                          <div className="text-lg font-bold text-accent">
                            {client.total_loaded.toFixed(0)}
                          </div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                        
                        <div className="text-center p-2 bg-green-500/10 rounded-lg">
                          <ArrowDownToLine className="h-5 w-5 text-green-600 mx-auto mb-1" />
                          <div className="text-lg font-bold text-green-600">
                            {client.withdrawable_balance.toFixed(0)}
                          </div>
                          <div className="text-xs text-muted-foreground">Retirable</div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </CollapsibleTrigger>
            </Collapsible>

            {/* Package Selection */}
            <Card>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm">Paquetes Predefinidos</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  {predefinedPackages.map((pkg) => (
                    <Card 
                      key={pkg.id}
                      className={`cursor-pointer transition-all hover:scale-[1.02] ${
                        selectedPackage === pkg.id 
                          ? 'ring-1 ring-primary shadow-md' 
                          : 'hover:shadow-sm'
                      }`}
                      onClick={() => handlePackageSelect(pkg)}
                    >
                      <CardContent className="p-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${pkg.color}`} />
                          <div className="flex-1">
                            <h4 className="font-medium text-xs">{pkg.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {pkg.amount} fichas
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            {formatCurrency(pkg.price)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transaction Details */}
            <Card>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm">Detalles de la Transacción</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-3 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium mb-1 block">
                      Cantidad de Fichas
                    </label>
                    <Input
                      type="number"
                      placeholder="Ingrese cantidad"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium mb-1 block flex items-center gap-1">
                      <Receipt className="h-3 w-3" />
                      Nº Comprobante *
                    </label>
                    <Input
                      placeholder="Ej: COMP-001234"
                      value={receiptNumber}
                      onChange={(e) => setReceiptNumber(e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium mb-1 block">
                    Notas (Opcional)
                  </label>
                  <Textarea
                    placeholder="Agregar notas sobre la transacción..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[60px] text-sm"
                  />
                </div>

                {/* Agent Info */}
                <div className="p-2 bg-muted/50 rounded-md">
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium">Agente:</span>
                    <span className="text-xs">{profile?.name || 'Usuario actual'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 border-t bg-muted/30">
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} size="sm">
              Cancelar
            </Button>
            <Button 
              onClick={handleCreditLoad}
              disabled={loading || !customAmount || !receiptNumber}
              className="min-w-[120px]"
              size="sm"
            >
              {loading ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Procesando...
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Cargar Fichas
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}