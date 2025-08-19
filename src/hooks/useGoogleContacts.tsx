import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface GoogleContact {
  resourceName: string;
  names?: { displayName: string }[];
  emailAddresses?: { value: string }[];
  phoneNumbers?: { value: string }[];
  photos?: { url: string }[];
}

interface ProcessedContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export const useGoogleContacts = () => {
  const [contacts, setContacts] = useState<ProcessedContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { session } = useAuth();

  const fetchContacts = useCallback(async () => {
    if (!session?.provider_token) {
      setError('No hay token de Google disponible');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,photos',
        {
          headers: {
            Authorization: `Bearer ${session.provider_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error al obtener contactos: ${response.status}`);
      }

      const data = await response.json();
      
      const processedContacts: ProcessedContact[] = (data.connections || [])
        .map((contact: GoogleContact) => ({
          id: contact.resourceName,
          name: contact.names?.[0]?.displayName || 'Sin nombre',
          email: contact.emailAddresses?.[0]?.value,
          phone: contact.phoneNumbers?.[0]?.value,
          avatar: contact.photos?.[0]?.url,
        }))
        .filter((contact: ProcessedContact) => contact.name !== 'Sin nombre');

      setContacts(processedContacts);
    } catch (err: any) {
      setError(err.message || 'Error al cargar contactos de Google');
      console.error('Error fetching Google contacts:', err);
    } finally {
      setLoading(false);
    }
  }, [session?.provider_token]);

  const syncContactsToSupabase = useCallback(async () => {
    if (contacts.length === 0) {
      setError('No hay contactos para sincronizar');
      return;
    }

    // This would sync contacts to the Supabase contacts table
    // Implementation would depend on your specific requirements
    console.log('Syncing contacts to Supabase:', contacts);
  }, [contacts]);

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    syncContactsToSupabase,
  };
};