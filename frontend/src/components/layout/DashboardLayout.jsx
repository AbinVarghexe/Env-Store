"use client";

import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "./Sidebar";

export function DashboardLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[rgb(var(--primary))] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      <Sidebar />
      <main className="ml-[250px] p-8 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
