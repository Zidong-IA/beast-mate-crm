import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  user_id: string;
  role: 'admin' | 'agent' | 'client';
  name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  balance: number;
  total_loaded: number;
  withdrawable_balance: number;
  status: string;
  agent_id?: string;
  google_contact_id?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  client_id: string;
  agent_id: string;
  amount: number;
  type: 'load' | 'withdraw' | 'transfer';
  receipt_number?: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
  metadata?: any;
  created_at: string;
}

export function useUserProfiles() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [clients, setClients] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Get current user profile
  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return;
    }

    if (!data && user) {
      // Create profile if it doesn't exist
      const newProfile = {
        user_id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0],
        email: user.email,
        role: 'client' as const,
      };

      const { data: created, error: createError } = await supabase
        .from('user_profiles')
        .insert(newProfile)
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        return;
      }

      setProfile(created);
    } else {
      setProfile(data);
    }
  };

  // Get clients assigned to current agent
  const fetchClients = async () => {
    if (!user || !profile || profile.role !== 'agent') return;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('agent_id', profile.id);

    if (error) {
      console.error('Error fetching clients:', error);
      return;
    }

    setClients(data || []);
  };

  // Get transactions
  const fetchTransactions = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .or(`client_id.eq.${profile.id},agent_id.eq.${profile.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }

    // Type assertion for the transaction data
    const typedTransactions = (data || []).map(transaction => ({
      ...transaction,
      type: transaction.type as 'load' | 'withdraw' | 'transfer',
      status: transaction.status as 'pending' | 'completed' | 'cancelled'
    }));

    setTransactions(typedTransactions);
  };

  // Create credit transaction
  const createCreditTransaction = async (
    clientId: string,
    amount: number,
    type: 'load' | 'withdraw' | 'transfer',
    receiptNumber?: string,
    notes?: string
  ) => {
    if (!profile || profile.role !== 'agent') {
      throw new Error('Only agents can create transactions');
    }

    const transaction = {
      client_id: clientId,
      agent_id: profile.id,
      amount,
      type,
      receipt_number: receiptNumber,
      notes,
      status: 'completed' as const,
    };

    const { data, error } = await supabase
      .from('credit_transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }

    // Update client balance
    if (type === 'load') {
      // Get current balance first
      const { data: currentClient, error: fetchError } = await supabase
        .from('user_profiles')
        .select('balance, total_loaded, withdrawable_balance')
        .eq('id', clientId)
        .single();

      if (fetchError) {
        console.error('Error fetching current balance:', fetchError);
        throw fetchError;
      }

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          balance: (currentClient.balance || 0) + amount,
          total_loaded: (currentClient.total_loaded || 0) + amount,
          withdrawable_balance: (currentClient.withdrawable_balance || 0) + amount
        })
        .eq('id', clientId);

      if (updateError) {
        console.error('Error updating client balance:', updateError);
        throw updateError;
      }
    }

    await fetchTransactions();
    await fetchClients();
    return data;
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', profile.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    setProfile(data);
    return data;
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setLoading(false);
      if (profile.role === 'agent') {
        fetchClients();
      }
      fetchTransactions();
    }
  }, [profile]);

  return {
    profile,
    clients,
    transactions,
    loading,
    createCreditTransaction,
    updateProfile,
    refetch: fetchProfile,
  };
}