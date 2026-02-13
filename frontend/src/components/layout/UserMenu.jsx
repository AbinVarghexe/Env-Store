"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User as UserIcon, Settings, Shield } from "lucide-react";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2) || "U"
    );
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:ring-2 hover:ring-blue-500/50 transition-all"
      >
        {getInitials(user?.name)}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-white/5 bg-[#1a1b26] p-1.5 shadow-2xl z-50 shadow-black/50"
          >
            <div className="px-3 py-3 border-b border-white/5 mb-1">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400 capitalize">
                  {user?.plan || "Free"} Plan
                </span>
              </div>
            </div>

            <div className="space-y-0.5">
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                <UserIcon className="h-4 w-4" />
                Profile
              </button>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                <Settings className="h-4 w-4" />
                Settings
              </button>
              {user?.twoFactorEnabled && (
                <div className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-emerald-400/70">
                  <Shield className="h-4 w-4" />
                  2FA Enabled
                </div>
              )}
            </div>

            <div className="mt-1 border-t border-white/5 pt-1">
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-rose-400/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
