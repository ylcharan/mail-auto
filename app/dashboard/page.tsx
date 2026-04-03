"use client";

import { InboxView } from "@/components/emails";

/**
 * Root Dashboard Component
 */
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white">
      <main className="max-w-6xl mx-auto p-6 sm:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Emails</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage and view your Gmail inbox
          </p>
        </header>

        <InboxView />
      </main>
    </div>
  );
}
