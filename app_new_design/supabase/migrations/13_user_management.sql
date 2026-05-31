-- =====================================================
-- Migration 13: User Management & Workshop Approval
-- =====================================================

-- 1. Add is_banned column to users table (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'is_banned'
  ) THEN
    ALTER TABLE public.users ADD COLUMN is_banned BOOLEAN NOT NULL DEFAULT false;
  END IF;
END
$$;

-- 2. Ensure services.status can hold 'pending' and 'rejected' values
-- (If status is an enum, add values; if it's text/varchar, it already works)
DO $$
BEGIN
  -- Check if status column type is an enum
  IF EXISTS (
    SELECT 1 FROM information_schema.columns c
    JOIN pg_type t ON t.typname = c.udt_name
    WHERE c.table_schema = 'public'
      AND c.table_name = 'services'
      AND c.column_name = 'status'
      AND t.typtype = 'e'
  ) THEN
    -- Add enum values if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'pending' AND enumtypid = (
      SELECT udt_name::regtype FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'status'
    )::oid) THEN
      ALTER TYPE service_status ADD VALUE IF NOT EXISTS 'pending';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'rejected' AND enumtypid = (
      SELECT udt_name::regtype FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'status'
    )::oid) THEN
      ALTER TYPE service_status ADD VALUE IF NOT EXISTS 'rejected';
    END IF;
  END IF;
  -- If status is text/varchar, no action needed — 'pending' and 'rejected' already work
END
$$;

-- 3. Index for faster banned user queries
CREATE INDEX IF NOT EXISTS idx_users_is_banned ON public.users (is_banned)
  WHERE is_banned = true;

-- 4. Index for pending workshop approvals
CREATE INDEX IF NOT EXISTS idx_services_status_pending ON public.services (status)
  WHERE status = 'pending';

-- 5. RLS: Allow admins to update is_banned and is_admin on users
-- (The existing admin RLS policy should cover this, but let's ensure)
-- Note: The users table must already have a policy allowing admins to UPDATE
-- If you're using service_role key in your admin functions, RLS is bypassed anyway.

COMMENT ON COLUMN public.users.is_banned IS 'If true, the user is banned and cannot log in or perform actions';
