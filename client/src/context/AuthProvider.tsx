'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Client components can use dynamic imports with { ssr: false }
const DynamicAuthProvider = dynamic(
  () => import('@/context/AuthContext').then(mod => mod.AuthProvider),
  { ssr: false }
);

export default function ClientAuthProvider({ children }: { children: ReactNode }) {
  return <DynamicAuthProvider>{children}</DynamicAuthProvider>;
}