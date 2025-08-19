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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Cargar Fichas - Sistema Avanzado
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Client Profile Section */}
            <Collapsible open={isProfileExpanded} onOpenChange={setIsProfileExpanded}>
              <CollapsibleTrigger asChild>
                <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={client.avatar_url} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {client.name?.split(' ').map(n => n[0]).join('') || 'CL'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{client.name || 'Cliente'}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              ID: {client.id.slice(-8)}
                            </Badge>
                            <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {client.status === 'active' ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {isProfileExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">{client.email || 'No disponible'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Miembro desde:</span>
                            <span className="font-medium">
                              {new Date(client.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {client.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Teléfono:</span>
                              <span className="font-medium">{client.phone}</span>
                            </div>
                          )}
                          {client.google_contact_id && (
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">Google Contacts</span>
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
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        Balance Actual
                      </CardTitle>
                      {isBalanceExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-primary/10 rounded-lg">
                          <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                          <div className="text-2xl font-bold text-primary">
                            {client.balance.toFixed(0)}
                          </div>
                          <div className="text-sm text-muted-foreground">Fichas Disponibles</div>
                        </div>
                        
                        <div className="text-center p-4 bg-accent/10 rounded-lg">
                          <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
                          <div className="text-2xl font-bold text-accent">
                            {client.total_loaded.toFixed(0)}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Cargado</div>
                        </div>
                        
                        <div className="text-center p-4 bg-green-500/10 rounded-lg">
                          <ArrowDownToLine className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-green-600">
                            {client.withdrawable_balance.toFixed(0)}
                          </div>
                          <div className="text-sm text-muted-foreground">Retirable</div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </CollapsibleTrigger>
            </Collapsible>

            {/* Package Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Paquetes Predefinidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {predefinedPackages.map((pkg) => (
                    <Card 
                      key={pkg.id}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        selectedPackage === pkg.id 
                          ? 'ring-2 ring-primary shadow-lg' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => handlePackageSelect(pkg)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${pkg.color}`} />
                          <div className="flex-1">
                            <h4 className="font-medium">{pkg.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {pkg.amount} fichas
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
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
              <CardHeader>
                <CardTitle className="text-lg">Detalles de la Transacción</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Cantidad de Fichas
                    </label>
                    <Input
                      type="number"
                      placeholder="Ingrese cantidad"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block flex items-center gap-1">
                      <Receipt className="h-4 w-4" />
                      Nº Comprobante *
                    </label>
                    <Input
                      placeholder="Ej: COMP-001234"
                      value={receiptNumber}
                      onChange={(e) => setReceiptNumber(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Notas (Opcional)
                  </label>
                  <Textarea
                    placeholder="Agregar notas sobre la transacción..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                {/* Agent Info */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Agente responsable:</span>
                    <span className="text-sm">{profile?.name || 'Usuario actual'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t bg-muted/30">
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreditLoad}
              disabled={loading || !customAmount || !receiptNumber}
              className="min-w-[140px]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Procesando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
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