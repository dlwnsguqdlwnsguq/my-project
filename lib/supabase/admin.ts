import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

/**
 * Admin client using Service Role Key
 * Only use in server-side code (Server Actions, Route Handlers)
 * Bypasses RLS policies
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
