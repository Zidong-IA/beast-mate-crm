-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('admin', 'agent', 'client');

-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'client',
  name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  balance DECIMAL(10,2) DEFAULT 0.00,
  total_loaded DECIMAL(10,2) DEFAULT 0.00,
  withdrawable_balance DECIMAL(10,2) DEFAULT 0.00,
  status TEXT DEFAULT 'active',
  agent_id UUID,
  google_contact_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Agents can view their assigned clients"
ON public.user_profiles
FOR SELECT
USING (agent_id = auth.uid());

CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.user_id = auth.uid() AND up.role = 'admin'
  )
);

-- Create credit transactions table
CREATE TABLE public.credit_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.user_profiles(id),
  agent_id UUID NOT NULL REFERENCES public.user_profiles(id),
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('load', 'withdraw', 'transfer')),
  receipt_number TEXT,
  notes TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "Users can view their own transactions"
ON public.credit_transactions
FOR SELECT
USING (
  client_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid()) OR
  agent_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Agents can create transactions for their clients"
ON public.credit_transactions
FOR INSERT
WITH CHECK (
  agent_id IN (SELECT id FROM public.user_profiles WHERE user_id = auth.uid() AND role = 'agent') AND
  client_id IN (SELECT id FROM public.user_profiles WHERE agent_id = auth.uid())
);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_profile_updated_at();

-- Function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_profiles WHERE user_id = auth.uid();
$$;