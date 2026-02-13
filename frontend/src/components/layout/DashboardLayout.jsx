"use client";

import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "./Sidebar";
import { UserMenu } from "./UserMenu";

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
      <div className="ml-[250px] min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-end px-8 border-b border-white/5 bg-[rgb(var(--background))]/80 backdrop-blur-md">
          <UserMenu />
        </header>

        <main className="flex-1 p-8 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
