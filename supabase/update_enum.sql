-- Add missing values to resource_type enum
-- We have to run these one by one because ALTER TYPE ... ADD VALUE cannot be run in a transaction block usually, 
-- but in Supabase SQL editor it works fine sequentially.

ALTER TYPE public.resource_type ADD VALUE IF NOT EXISTS 'auditorium';
ALTER TYPE public.resource_type ADD VALUE IF NOT EXISTS 'hall';
ALTER TYPE public.resource_type ADD VALUE IF NOT EXISTS 'other';

-- Verify
SELECT enum_range(NULL::public.resource_type);
