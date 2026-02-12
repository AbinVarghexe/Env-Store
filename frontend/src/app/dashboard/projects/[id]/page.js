"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Loader2,
  Layers,
  Check,
  KeyRound,
} from "lucide-react";
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
import { useSecrets } from "@/hooks/useSecrets";
import api from "@/lib/api";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id;

  const [project, setProject] = useState(null);
  const [environments, setEnvironments] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);

  const { secrets, loading, fetchSecrets, createSecret, deleteSecret, revealSecret } = useSecrets(
    projectId,
    selectedEnv?._id
  );

  const [showAdd, setShowAdd] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [creating, setCreating] = useState(false);

  const [revealedValues, setRevealedValues] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const loadProject = useCallback(async () => {
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setProject(data.project);
      setEnvironments(data.environments);
      if (data.environments.length > 0) {
        setSelectedEnv(data.environments[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProject(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  useEffect(() => {
    if (selectedEnv) {
      fetchSecrets();
    }
  }, [selectedEnv, fetchSecrets]);

  const handleAddSecret = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createSecret(newKey, newValue);
      setShowAdd(false);
      setNewKey("");
      setNewValue("");
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleReveal = async (secretId) => {
    if (revealedValues[secretId]) {
      setRevealedValues((prev) => {
        const next = { ...prev };
        delete next[secretId];
        return next;
      });
      return;
    }

    try {
      const value = await revealSecret(secretId);
      setRevealedValues((prev) => ({ ...prev, [secretId]: value }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = async (secretId) => {
    try {
      let value = revealedValues[secretId];
      if (!value) {
        value = await revealSecret(secretId);
      }
      await navigator.clipboard.writeText(value);
      setCopiedId(secretId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loadingProject) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[rgb(var(--primary))]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">{project?.name}</h1>
            <p className="text-sm text-[rgb(var(--muted-foreground))]">
              {project?.description || "Manage secrets for this project"}
            </p>
          </div>
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Secret
          </Button>
        </div>

        {/* Environment Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {environments.map((env) => (
            <button
              key={env._id}
              onClick={() => setSelectedEnv(env)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedEnv?._id === env._id
                  ? "bg-[rgb(var(--primary))] text-white"
                  : "bg-[rgb(var(--secondary))] text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))]"
              }`}
            >
              <Layers className="h-3.5 w-3.5 inline mr-1.5" />
              {env.name}
            </button>
          ))}
        </div>

        {/* Secrets Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[rgb(var(--primary))]" />
          </div>
        ) : secrets.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <KeyRound className="h-12 w-12 text-[rgb(var(--muted-foreground))] mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No secrets yet</h3>
              <p className="text-[rgb(var(--muted-foreground))] text-sm mb-6">
                Add your first secret securely.
              </p>
              <Button onClick={() => setShowAdd(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add Secret
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgb(var(--border))]">
                    <th className="text-left py-3 px-4 text-xs font-medium text-[rgb(var(--muted-foreground))] uppercase tracking-wider">
                      Key
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[rgb(var(--muted-foreground))] uppercase tracking-wider">
                      Value
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[rgb(var(--muted-foreground))] uppercase tracking-wider">
                      Version
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[rgb(var(--muted-foreground))] uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-[rgb(var(--muted-foreground))] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {secrets.map((secret, i) => (
                    <motion.tr
                      key={secret._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-[rgb(var(--border))] last:border-0 hover:bg-[rgb(var(--accent))/0.5] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <code className="text-sm font-mono font-medium text-[rgb(var(--primary))]">
                          {secret.key}
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-mono text-[rgb(var(--muted-foreground))]">
                          {revealedValues[secret._id] || "••••••••••••"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">v{secret.version}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-[rgb(var(--muted-foreground))]">
                        {new Date(secret.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleReveal(secret._id)}
                            className="p-1.5 rounded hover:bg-[rgb(var(--accent))] transition-colors"
                            title={revealedValues[secret._id] ? "Hide" : "Reveal"}
                          >
                            {revealedValues[secret._id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleCopy(secret._id)}
                            className="p-1.5 rounded hover:bg-[rgb(var(--accent))] transition-colors"
                            title="Copy"
                          >
                            {copiedId === secret._id ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteSecret(secret._id)}
                            className="p-1.5 rounded hover:bg-red-500/10 text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Add Secret Dialog */}
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Secret</DialogTitle>
              <DialogDescription>
                Add a new secret to the {selectedEnv?.name} environment.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSecret} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Key</label>
                <Input
                  placeholder="STRIPE_SECRET_KEY"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value.toUpperCase().replace(/\s/g, "_"))}
                  className="font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Value</label>
                <textarea
                  placeholder="sk_live_..."
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  required
                  rows={3}
                  className="flex w-full rounded-lg border border-[rgb(var(--input))] bg-transparent px-3 py-2 text-sm font-mono placeholder:text-[rgb(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))] focus:ring-offset-1 transition-all duration-200"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
