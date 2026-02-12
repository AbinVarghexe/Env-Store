"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/lib/api";

const actionColors = {
  "secret.create": "success",
  "secret.update": "warning",
  "secret.delete": "destructive",
  "secret.reveal": "secondary",
  "auth.login": "default",
  "auth.login.failed": "destructive",
  "project.create": "success",
  "project.delete": "destructive",
  "token.create": "success",
  "token.revoke": "warning",
};

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchLogs = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/audit?page=${page}&limit=20`);
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Audit Logs</h1>
            <p className="text-[rgb(var(--muted-foreground))] text-sm">
              Track all activity on your account.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[rgb(var(--primary))]" />
          </div>
        ) : logs.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <FileText className="h-12 w-12 text-[rgb(var(--muted-foreground))] mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
              <p className="text-[rgb(var(--muted-foreground))] text-sm">
                Your activity will appear here once you start using DevVault.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <div className="divide-y divide-[rgb(var(--border))]">
                {logs.map((log, i) => (
                  <motion.div
                    key={log._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[rgb(var(--accent))/0.5] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant={actionColors[log.action] || "secondary"} className="text-xs w-36 justify-center">
                        {log.action}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">
                          {log.userId?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-[rgb(var(--muted-foreground))]">
                          {log.metadata?.path || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-[rgb(var(--muted-foreground))] text-right">
                      <p>{new Date(log.createdAt).toLocaleDateString()}</p>
                      <p>{new Date(log.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === pagination.page ? "default" : "outline"}
                    size="sm"
                    onClick={() => fetchLogs(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
