"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, ShieldAlert, Key, Edit, Trash, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import api from "@/lib/api";

const actionIcons = {
  CREATE_SECRET: Plus,
  READ_SECRET: Key,
  UPDATE_SECRET: Edit,
  DELETE_SECRET: Trash,
  CREATE_PROJECT: Plus,
  DELETE_PROJECT: Trash,
  generate_token: Key,
  revoke_token: ShieldAlert,
  login: Activity,
  login_failed: ShieldAlert,
};

const actionColors = {
  CREATE_SECRET: "bg-emerald-500/10 text-emerald-500",
  READ_SECRET: "bg-blue-500/10 text-blue-500",
  UPDATE_SECRET: "bg-amber-500/10 text-amber-500",
  DELETE_SECRET: "bg-red-500/10 text-red-500",
  login_failed: "bg-red-500/10 text-red-500",
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 w-full bg-[rgb(var(--muted))]/20 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : logs.length === 0 ? (
              <p className="text-center text-[rgb(var(--muted-foreground))] text-sm py-4">
                No recent activity.
              </p>
            ) : (
              logs.map((log, i) => {
                const Icon = actionIcons[log.action] || Activity;
                const colorClass =
                  actionColors[log.action] ||
                  "bg-[rgb(var(--primary))]/10 text-[rgb(var(--primary))]";

                return (
                  <motion.div
                    key={log._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-[rgb(var(--muted))]/5 transition-colors"
                  >
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        <span className="font-bold">{log.user?.name}</span>{" "}
                        {log.action.replace(/_/g, " ").toLowerCase()}
                      </p>
                      <p className="text-xs text-[rgb(var(--muted-foreground))] flex items-center gap-2">
                        {new Date(log.timestamp).toLocaleString()}
                        {log.metadata?.target && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1 py-0 h-4"
                          >
                            {log.metadata.target}
                          </Badge>
                        )}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
