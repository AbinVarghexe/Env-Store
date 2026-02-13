"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ShieldAlert,
  Key,
  Edit,
  Trash,
  Plus,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import api from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";

const actionConfig = {
  "secret.create": {
    icon: Plus,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  "secret.read": { icon: Eye, color: "text-blue-400", bg: "bg-blue-400/10" },
  "secret.update": {
    icon: Edit,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  "secret.delete": {
    icon: Trash,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
  },
  "secret.reveal": {
    icon: Eye,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  "project.create": {
    icon: Plus,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  "project.delete": {
    icon: Trash,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
  },
  "token.create": { icon: Key, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  "token.revoke": {
    icon: ShieldAlert,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
  },
  "auth.login": {
    icon: Activity,
    color: "text-slate-400",
    bg: "bg-slate-400/10",
  },
  "auth.login.failed": {
    icon: ShieldAlert,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
  },
};

export function RecentActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await api.get("/audit?limit=5");
        setLogs(data.logs);
      } catch (err) {
        console.error("Failed to fetch activity logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border border-white/5 bg-[#1a1b26] shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-white">
            Recent Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/5 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse" />
                      <div className="h-3 w-1/2 rounded bg-white/5 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : logs.length === 0 ? (
              <p className="text-center text-slate-500 py-8">
                No recent activity.
              </p>
            ) : (
              logs.map((log, i) => {
                const config = actionConfig[log.action] || {
                  icon: Activity,
                  color: "text-slate-400",
                  bg: "bg-slate-400/10",
                };
                const Icon = config.icon;

                return (
                  <div key={log._id} className="group relative flex gap-4">
                    {/* Timeline Line */}
                    {i !== logs.length - 1 && (
                      <div className="absolute left-[19px] top-10 h-full w-[2px] bg-white/5 group-hover:bg-white/10 transition-colors" />
                    )}

                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/5 transition-colors",
                        config.bg,
                        config.color,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="pb-1">
                      <p className="text-sm font-medium text-white">
                        <span className="font-bold text-slate-200">
                          {log.user?.name}
                        </span>{" "}
                        <span className="text-slate-400">
                          {log.action.split(".").slice(1).join(" ")}
                        </span>
                        {log.metadata?.key && (
                          <span className="text-blue-400">
                            {" "}
                            {log.metadata.key}
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 flex items-center gap-2">
                        {formatTimeAgo(log.timestamp)}
                        {log.metadata?.target && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500">
                              {log.metadata.target}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            )}

            <Link href="/dashboard/audit" className="block w-full">
              <div className="mt-4 rounded-lg border border-white/10 bg-white/5 py-2 text-center text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
                View All Logs
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
