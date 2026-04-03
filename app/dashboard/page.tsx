/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

function Sidebar({
  active,
  onNav,
}: {
  active: string;
  onNav: (tab: string) => void;
}) {
  const navItems = [
    { key: "inbox", label: "Inbox" },
    { key: "automation", label: "Automation" },
    { key: "analytics", label: "Analytics" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-4">
      <h2 className="text-xl font-bold text-black dark:text-white mb-6">
        Menu
      </h2>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => onNav(item.key)}
              className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition ${
                active === item.key
                  ? "bg-gray-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function InboxView() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for error from callback
    const params = new URLSearchParams(window.location.search);
    const callbackError = params.get("error");

    if (callbackError) {
      setError(callbackError);
      setLoading(false);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    const fetchEmails = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/emails");

        if (!response.ok) {
          if (response.status === 401) {
            setError("Gmail not connected. Please connect your Gmail account.");
          } else {
            setError("Failed to fetch emails");
          }
          return;
        }

        const data = await response.json();
        setEmails(data.messages || []);
        setError(null);
      } catch (err) {
        setError("Error fetching emails");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
      <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
        Inbox
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="size-6 mr-3" />
          <p className="text-zinc-500 dark:text-zinc-400">Loading emails...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 dark:bg-red-950 p-4">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          <div className="flex gap-3 mt-4">
            <Button
              size="sm"
              onClick={() => (window.location.href = "/api/google/connect")}
            >
              Connect Gmail
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      ) : emails.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-zinc-500 dark:text-zinc-400">No emails found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {emails.map((email: any) => (
            <div
              key={email.id}
              className="rounded-lg border border-zinc-100 dark:border-zinc-800 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition"
            >
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {email.from}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {email.subject}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {email.date}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AutomationView() {
  const rules = [
    { name: "Welcome new subscribers", status: "Active" },
    { name: "Weekly status update", status: "Paused" },
    { name: "Birthday discount", status: "Active" },
  ];

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Automation
        </h2>
        <Button size="sm">Add Rule</Button>
      </div>
      <div className="space-y-3">
        {rules.map((rule, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center rounded-lg border border-zinc-100 dark:border-zinc-800 p-4"
          >
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {rule.name}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {rule.status}
              </p>
            </div>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
      <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
        Analytics
      </h2>
      <div className="h-52 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
        Analytics content coming soon...
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
      <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
        Settings
      </h2>
      <div className="h-32 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
        Settings content coming soon...
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("inbox");

  const renderContent = () => {
    switch (activeTab) {
      case "inbox":
        return <InboxView />;
      case "automation":
        return <AutomationView />;
      case "analytics":
        return <AnalyticsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <InboxView />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white">
      <div className="flex">
        <Sidebar active={activeTab} onNav={setActiveTab} />

        <main className="flex-1 p-6 sm:p-8">
          <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
