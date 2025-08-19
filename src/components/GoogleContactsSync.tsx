import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGoogleContacts } from '@/hooks/useGoogleContacts';
import { Download, RefreshCcw, Users, AlertCircle } from 'lucide-react';

const GoogleContactsSync = () => {
  const { contacts, loading, error, fetchContacts, syncContactsToSupabase } = useGoogleContacts();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncContactsToSupabase();
    } catch (err) {
      console.error('Error syncing contacts:', err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Sincronización de Contactos Google
          </CardTitle>
          <CardDescription>
            Importa y sincroniza tus contactos de Google para usarlos en BeastCRM
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={fetchContacts}
              disabled={loading}
              variant="outline"
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Cargando...' : 'Cargar Contactos'}
            </Button>

            {contacts.length > 0 && (
              <Button
                onClick={handleSync}
                disabled={syncing}
              >
                <Download className="h-4 w-4 mr-2" />
                {syncing ? 'Sincronizando...' : `Sincronizar ${contacts.length} contactos`}
              </Button>
            )}
          </div>

          {contacts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {contacts.length} contactos encontrados
                </Badge>
              </div>

              <ScrollArea className="h-60 w-full border rounded-lg p-4">
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center gap-3 p-2 rounded-lg border">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>
                          {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{contact.name}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          {contact.email && <span>{contact.email}</span>}
                          {contact.phone && <span>{contact.phone}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleContactsSync;