-- FIX: specific Enum migration issues by converting to TEXT
-- This is often safer during rapid development to avoid "invalid input value" errors

-- 1. Alter the column to text (automatically converts existing values)
ALTER TABLE public.resources 
ALTER COLUMN type TYPE text;

-- 2. Drop the old type (optional, but clean)
DROP TYPE IF EXISTS public.resource_type;

-- 3. (Optional) Add a check constraint if you want validation, 
-- but for now let's leave it open to support 'auditorium', 'hall', etc.
-- ALTER TABLE public.resources ADD CONSTRAINT check_resource_type 
-- CHECK (type IN ('room', 'hall', 'auditorium', 'equipment', 'other'));
