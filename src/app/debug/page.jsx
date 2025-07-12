'use client';

import { ProfileMenuButton } from '@/components/ui/ProfileMenuButton';

export default function DebugPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-xl mb-4">Debug Page</h1>
      <ProfileMenuButton
        name="Alex"
        email="alex@example.com"
        // imageUrl is intentionally omitted to test fallback
      />
    </div>
  );
}
