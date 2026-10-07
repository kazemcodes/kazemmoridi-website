-- ==============================================================================
-- KM Studio — security upgrade + contact inbox
-- Run once in Supabase Dashboard → SQL Editor, after the original schema.sql.
-- Replaces the old "anon full access" policies with admin-only access.
-- ==============================================================================

-- 1. Admin list (add your auth user id after creating the user in Auth → Users)
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admins read self" ON public.admins;
CREATE POLICY "admins read self" ON public.admins FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2. Contact inbox
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  contact TEXT NOT NULL CHECK (char_length(contact) BETWEEN 3 AND 160),
  budget TEXT CHECK (budget IS NULL OR char_length(budget) <= 80),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 4000),
  locale TEXT NOT NULL DEFAULT 'fa',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;

DROP POLICY IF EXISTS "anyone can submit" ON public.contact_messages;
CREATE POLICY "anyone can submit" ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (read = false);
DROP POLICY IF EXISTS "admins manage messages" ON public.contact_messages;
CREATE POLICY "admins manage messages" ON public.contact_messages FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. Lock down studio tables to admins only
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['clients','invoices','invoice_items','official_letters','studio_profile'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Allow anon full access to %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated full access to %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "admins full access" ON public.%I', t);
    EXECUTE format('CREATE POLICY "admins full access" ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
  END LOOP;
END $$;

-- 4. Make yourself admin (replace the email):
-- INSERT INTO public.admins (user_id) SELECT id FROM auth.users WHERE email = 'kazem.codes@gmail.com';
