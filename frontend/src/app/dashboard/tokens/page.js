"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Key, Trash2, Loader2, Copy, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import api from "@/lib/api";

export default function TokensPage() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [tokenProjectId, setTokenProjectId] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [creating, setCreating] = useState(false);
  const [newRawToken, setNewRawToken] = useState(null);
  const [copied, setCopied] = useState(false);
  const [projects, setProjects] = useState([]);

  const fetchTokens = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/tokens");
      setTokens(data.tokens);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data.projects);
      if (data.projects.length > 0) {
        setTokenProjectId(data.projects[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchTokens();
    fetchProjects();
  }, [fetchTokens, fetchProjects]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await api.post("/tokens", {
        name: tokenName,
        projectId: tokenProjectId,
        expiresInDays,
      });
      setNewRawToken(data.token);
      fetchTokens();
      setTokenName("");
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id) => {
    try {
      await api.delete(`/tokens/${id}`);
      setTokens((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyToken = async () => {
    await navigator.clipboard.writeText(newRawToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">API Tokens</h1>
            <p className="text-[rgb(var(--muted-foreground))] text-sm">
              Manage API tokens for programmatic access.
            </p>
          </div>
          <Button onClick={() => { setShowCreate(true); setNewRawToken(null); }}>
            <Plus className="h-4 w-4 mr-2" /> New Token
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[rgb(var(--primary))]" />
          </div>
        ) : tokens.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Key className="h-12 w-12 text-[rgb(var(--muted-foreground))] mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No API tokens</h3>
              <p className="text-[rgb(var(--muted-foreground))] text-sm mb-6">
                Create an API token to access secrets programmatically.
              </p>
              <Button onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4 mr-2" /> Create Token
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {tokens.map((token, i) => (
              <motion.div
                key={token._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:border-[rgb(var(--primary))/0.3] transition-colors">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-[rgb(var(--primary))/0.1] flex items-center justify-center">
                        <Key className="h-4 w-4 text-[rgb(var(--primary))]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{token.name}</h3>
                        <p className="text-xs text-[rgb(var(--muted-foreground))]">
                          Expires: {new Date(token.expiresAt).toLocaleDateString()}
                          {token.lastUsed && ` · Last used: ${new Date(token.lastUsed).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRevoke(token._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Revoke
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Token Dialog */}
        <Dialog open={showCreate} onOpenChange={(open) => { setShowCreate(open); if (!open) setNewRawToken(null); }}>
          <DialogContent>
            {newRawToken ? (
              <>
                <DialogHeader>
                  <DialogTitle>Token Created</DialogTitle>
                  <DialogDescription>
                    Copy this token now. It will not be shown again.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 p-3 bg-[rgb(var(--secondary))] rounded-lg font-mono text-sm break-all">
                  {newRawToken}
                </div>
                <div className="flex items-center gap-2 mt-2 text-amber-500 text-xs">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Save this token — you won&apos;t see it again.</span>
                </div>
                <DialogFooter className="mt-4">
                  <Button onClick={handleCopyToken}>
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Token"}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Create API Token</DialogTitle>
                  <DialogDescription>Generate a new token for programmatic access.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Token Name</label>
                    <Input
                      placeholder="CI/CD Pipeline"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Project</label>
                    <select
                      value={tokenProjectId}
                      onChange={(e) => setTokenProjectId(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-[rgb(var(--input))] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
                      required
                    >
                      {projects.map((p) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Expires In (days)</label>
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      value={expiresInDays}
                      onChange={(e) => setExpiresInDays(parseInt(e.target.value))}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={creating}>
                      {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
                    </Button>
                  </DialogFooter>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
