-- ==============================================================================
-- KM STUDIO - Supabase Database Schema
-- Modules: Invoices, Invoice Items, Official Letters, Clients, Studio Profile
-- ==============================================================================

-- 1. Clients Table (مشتریان و کارفرمایان)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  email TEXT,
  national_id TEXT,
  economic_code TEXT,
  postal_code TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Invoices Table (فاکتورها و پیش‌فاکتورها)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'invoice' CHECK (type IN ('invoice', 'proforma')), -- invoice = فاکتور فروش, proforma = پیش‌فاکتور
  title TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  buyer_name TEXT NOT NULL,
  buyer_company TEXT,
  buyer_national_id TEXT,
  buyer_economic_code TEXT,
  buyer_phone TEXT,
  buyer_postal_code TEXT,
  buyer_address TEXT,
  issue_date TEXT NOT NULL, -- فرمت شمسی ۱۴۰۴/۰۶/۲۰
  due_date TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'paid', 'cancelled')),
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  tax_percent NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT DEFAULT 'کارت به کارت / حواله بانکی',
  notes TEXT,
  terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Invoice Items Table (اقلام فاکتور)
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'مورد',
  unit_price NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  item_order INT DEFAULT 0
);

-- 4. Official Letters Table (نامه‌های رسمی و اداری)
CREATE TABLE IF NOT EXISTS official_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  letter_number TEXT NOT NULL UNIQUE,
  letter_date TEXT NOT NULL, -- فرمت شمسی ۱۴۰۴/۰۶/۲۰
  attachment TEXT DEFAULT 'ندارد',
  type TEXT NOT NULL DEFAULT 'official' CHECK (type IN ('official', 'contract', 'handover', 'recommendation')),
  subject TEXT NOT NULL,
  recipient_title TEXT NOT NULL, -- عنوان گیرنده مانند: ریاست محترم ...
  recipient_name TEXT,
  recipient_company TEXT,
  body TEXT NOT NULL,
  signee_title TEXT DEFAULT 'مدیریت مهندسی و توسعه',
  signee_name TEXT DEFAULT 'کاظم مریدی',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Studio Profile / Settings Table (اطلاعات رسمی استودیو)
CREATE TABLE IF NOT EXISTS studio_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name TEXT DEFAULT 'KM Studio — استودیو مریدی',
  manager_name TEXT DEFAULT 'کاظم مریدی',
  national_id TEXT DEFAULT '---',
  economic_code TEXT DEFAULT '---',
  registration_number TEXT DEFAULT '---',
  phone TEXT DEFAULT '+989170284463',
  phone_display TEXT DEFAULT '۰۹۱۷ ۰۲۸ ۴۴۶۳',
  email TEXT DEFAULT 'kazem.codes@gmail.com',
  website TEXT DEFAULT 'https://kazemmoridi.ir',
  sheba_number TEXT DEFAULT 'IR------------------------',
  card_number TEXT DEFAULT '---- ---- ---- ----',
  bank_name TEXT DEFAULT 'بانک ملی ایران',
  address TEXT DEFAULT 'هرمزگان، ایران',
  postal_code TEXT DEFAULT '---',
  logo_url TEXT,
  stamp_signature_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) policies
-- Supports both authenticated Supabase Auth users AND the project's anon client
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE official_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_profile ENABLE ROW LEVEL SECURITY;

-- 1. Clients Policies
DROP POLICY IF EXISTS "Allow authenticated full access to clients" ON clients;
DROP POLICY IF EXISTS "Allow anon full access to clients" ON clients;

CREATE POLICY "Allow authenticated full access to clients"
  ON clients FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon full access to clients"
  ON clients FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- 2. Invoices Policies
DROP POLICY IF EXISTS "Allow authenticated full access to invoices" ON invoices;
DROP POLICY IF EXISTS "Allow anon full access to invoices" ON invoices;

CREATE POLICY "Allow authenticated full access to invoices"
  ON invoices FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon full access to invoices"
  ON invoices FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- 3. Invoice Items Policies
DROP POLICY IF EXISTS "Allow authenticated full access to invoice_items" ON invoice_items;
DROP POLICY IF EXISTS "Allow anon full access to invoice_items" ON invoice_items;

CREATE POLICY "Allow authenticated full access to invoice_items"
  ON invoice_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon full access to invoice_items"
  ON invoice_items FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- 4. Official Letters Policies
DROP POLICY IF EXISTS "Allow authenticated full access to official_letters" ON official_letters;
DROP POLICY IF EXISTS "Allow anon full access to official_letters" ON official_letters;

CREATE POLICY "Allow authenticated full access to official_letters"
  ON official_letters FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon full access to official_letters"
  ON official_letters FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- 5. Studio Profile Policies
DROP POLICY IF EXISTS "Allow authenticated full access to studio_profile" ON studio_profile;
DROP POLICY IF EXISTS "Allow anon full access to studio_profile" ON studio_profile;

CREATE POLICY "Allow authenticated full access to studio_profile"
  ON studio_profile FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon full access to studio_profile"
  ON studio_profile FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

