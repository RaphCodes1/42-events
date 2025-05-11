'use client';

import { useState } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() =>
    createClientComponentClient() // or just createClientComponentClient()
  );

  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
}