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
  Users as UsersIcon,
  Download,
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
import { CollaboratorsSection } from "@/components/dashboard/CollaboratorsSection";
import { useSecrets } from "@/hooks/useSecrets";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id;

  const [project, setProject] = useState(null);
  const [environments, setEnvironments] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [activeTab, setActiveTab] = useState("secrets");

  const {
    secrets,
    loading,
    fetchSecrets,
    createSecret,
    deleteSecret,
    revealSecret,
  } = useSecrets(projectId, selectedEnv?._id);

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

  const handleDownload = async () => {
    if (!selectedEnv) return;
    try {
      const response = await api.get(
        `/projects/${projectId}/environments/${selectedEnv._id}/secrets/download`,
        {
          responseType: "text",
        },
      );

      const blob = new Blob([response.data || response], {
        type: "text/plain",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.name}.${selectedEnv.name}.env`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="border-white/5 bg-[#1a1b26] text-slate-300 hover:text-white hover:bg-white/5"
            >
              <Download className="h-4 w-4 mr-2" /> Download .env
            </Button>
            <Button
              onClick={() => setShowAdd(true)}
              className="bg-blue-600 hover:bg-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Secret
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-white/5 mb-6">
          <button
            onClick={() => setActiveTab("secrets")}
            className={cn(
              "pb-3 text-sm font-medium transition-all relative",
              activeTab === "secrets"
                ? "text-blue-500"
                : "text-slate-500 hover:text-slate-300",
            )}
          >
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Secrets
            </div>
            {activeTab === "secrets" && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("collaborators")}
            className={cn(
              "pb-3 text-sm font-medium transition-all relative",
              activeTab === "collaborators"
                ? "text-blue-500"
                : "text-slate-500 hover:text-slate-300",
            )}
          >
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              Collaborators
              {project?.members?.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/10 text-[10px] text-blue-400 ml-1">
                  {project.members.length}
                </span>
              )}
            </div>
            {activeTab === "collaborators" && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              />
            )}
          </button>
        </div>

        {activeTab === "secrets" ? (
          <>
            {/* Environment Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
              {environments.map((env) => (
                <button
                  key={env._id}
                  onClick={() => setSelectedEnv(env)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedEnv?._id === env._id
                      ? "bg-blue-600 text-white"
                      : "bg-[#1a1b26] text-slate-400 hover:text-white border border-white/5"
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
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : secrets.length === 0 ? (
              <Card className="text-center py-16 border-white/5 bg-[#1a1b26]">
                <CardContent>
                  <KeyRound className="h-12 w-12 text-slate-600 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    No secrets yet
                  </h3>
                  <p className="text-slate-400 text-sm mb-6">
                    Add your first secret securely.
                  </p>
                  <Button
                    onClick={() => setShowAdd(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Secret
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-white/5 bg-[#1a1b26]">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Key
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Version
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Updated
                        </th>
                        <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
                          className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <code className="text-sm font-mono font-medium text-blue-400">
                              {secret.key}
                            </code>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm font-mono text-slate-500">
                              {revealedValues[secret._id] || "••••••••••••"}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <Badge
                              variant="secondary"
                              className="bg-slate-800 text-slate-300 border-white/5"
                            >
                              v{secret.version}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-400">
                            {new Date(secret.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleReveal(secret._id)}
                                className="p-1.5 rounded hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
                                title={
                                  revealedValues[secret._id] ? "Hide" : "Reveal"
                                }
                              >
                                {revealedValues[secret._id] ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleCopy(secret._id)}
                                className="p-1.5 rounded hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
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
                                className="p-1.5 rounded hover:bg-red-500/10 text-red-500/70 hover:text-red-500 transition-colors"
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
          </>
        ) : (
          <CollaboratorsSection project={project} onUpdate={loadProject} />
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
                  onChange={(e) =>
                    setNewKey(e.target.value.toUpperCase().replace(/\s/g, "_"))
                  }
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
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
