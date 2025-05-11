import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

// Regular client for general use

// Admin client for admin operations
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Component client for Next.js client components
export const supabaseComponent = createClientComponentClient();

export const supabase = createPagesBrowserClient();