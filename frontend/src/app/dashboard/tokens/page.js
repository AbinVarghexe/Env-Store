"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Key,
  Trash2,
  Loader2,
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  Github,
  Brain,
  Zap,
  Shield,
  Eye,
  EyeOff,
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
import { cn } from "@/lib/utils";
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

  // Quick-Add State
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [quickAddValue, setQuickAddValue] = useState("");
  const [showQuickAddValue, setShowQuickAddValue] = useState(false);
  const [addingSecret, setAddingSecret] = useState(false);

  // Global Vault State
  const [globalSecrets, setGlobalSecrets] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(true);
  const [revealedGlobalValues, setRevealedGlobalValues] = useState({});

  // Tabs State
  const [activeTab, setActiveTab] = useState("global"); // "global" or "tokens"

  const integrations = [
    {
      id: "openai",
      name: "OpenAI",
      keyName: "OPENAI_API_KEY",
      icon: Sparkles,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      description: "Securely store your OpenAI API key for GPT-4 access.",
    },
    {
      id: "gemini",
      name: "Google Gemini",
      keyName: "GEMINI_API_KEY",
      icon: Brain,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      description: "Add your Google AI Studio key for Gemini Pro models.",
    },
    {
      id: "github",
      name: "GitHub",
      keyName: "GITHUB_TOKEN",
      icon: Github,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      description: "Manage your Personal Access Tokens for GitHub API.",
    },
  ];

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

  const fetchGlobalSecrets = useCallback(async () => {
    try {
      setLoadingGlobal(true);
      const { data } = await api.get("/global-secrets");
      setGlobalSecrets(data.secrets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGlobal(false);
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
    fetchGlobalSecrets();
  }, [fetchTokens, fetchProjects, fetchGlobalSecrets]);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!selectedService || !quickAddValue) return;

    setAddingSecret(true);
    try {
      await api.post("/global-secrets", {
        key: selectedService.keyName,
        value: quickAddValue,
        service: selectedService.id,
      });
      fetchGlobalSecrets();
      setShowQuickAdd(false);
      setQuickAddValue("");
      setShowQuickAddValue(false);
      // Optionally show success toast if available
    } catch (err) {
      console.error(err);
    } finally {
      setAddingSecret(false);
    }
  };

  const handleRevealGlobal = async (id) => {
    if (revealedGlobalValues[id]) {
      setRevealedGlobalValues((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }

    try {
      const { data } = await api.get(`/global-secrets/${id}/reveal`);
      setRevealedGlobalValues((prev) => ({ ...prev, [id]: data.value }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGlobal = async (id) => {
    try {
      await api.delete(`/global-secrets/${id}`);
      setGlobalSecrets((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

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
            <h1 className="text-2xl font-bold mb-1">API & Secrets</h1>
            <p className="text-[rgb(var(--muted-foreground))] text-sm">
              Manage your global service keys and programmatic tokens.
            </p>
          </div>
          {activeTab === "tokens" && (
            <Button
              onClick={() => {
                setShowCreate(true);
                setNewRawToken(null);
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> New Token
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-white/5 mb-8">
          <button
            onClick={() => setActiveTab("global")}
            className={cn(
              "pb-3 text-sm font-medium transition-all relative",
              activeTab === "global"
                ? "text-emerald-500"
                : "text-slate-500 hover:text-slate-300",
            )}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Global Vault
            </div>
            {activeTab === "global" && (
              <motion.div
                layoutId="token-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("tokens")}
            className={cn(
              "pb-3 text-sm font-medium transition-all relative",
              activeTab === "tokens"
                ? "text-blue-500"
                : "text-slate-500 hover:text-slate-300",
            )}
          >
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Generator
              {tokens.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/10 text-[10px] text-blue-400 ml-1">
                  {tokens.length}
                </span>
              )}
            </div>
            {activeTab === "tokens" && (
              <motion.div
                layoutId="token-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              />
            )}
          </button>
        </div>

        {activeTab === "tokens" ? (
          <div>
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
                    <Card className="hover:border-[rgb(var(--primary))/0.3] transition-colors border-white/5 bg-[#1a1b26]/50">
                      <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-lg bg-[rgb(var(--primary))/0.1] flex items-center justify-center">
                            <Key className="h-4 w-4 text-[rgb(var(--primary))]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">
                              {token.name}
                            </h3>
                            <p className="text-xs text-[rgb(var(--muted-foreground))]">
                              Expires:{" "}
                              {new Date(token.expiresAt).toLocaleDateString()}
                              {token.lastUsed &&
                                ` · Last used: ${new Date(token.lastUsed).toLocaleDateString()}`}
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
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            {/* Quick-Add Integrations Section */}
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500 fill-amber-500/20" />
                  Quick-Add Service Keys
                </h2>
                <p className="text-[rgb(var(--muted-foreground))] text-sm">
                  Instantly store keys for common services in your Global Vault.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {integrations.map((service, i) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedService(service);
                      setShowQuickAdd(true);
                    }}
                  >
                    <Card className="h-full border-white/5 bg-[#1a1b26] hover:border-emerald-500/30 transition-all group">
                      <CardContent className="p-6">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                            service.bg,
                          )}
                        >
                          <service.icon
                            className={cn("h-6 w-6", service.color)}
                          />
                        </div>
                        <h3 className="text-lg font-bold mb-2">
                          {service.name}
                        </h3>
                        <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                          {service.description}
                        </p>
                        <div className="flex items-center text-xs font-medium text-emerald-400 group-hover:underline">
                          Add {service.keyName}{" "}
                          <Plus className="h-3 w-3 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Global Vault List */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                    Global Vault Secrets
                  </h2>
                  <p className="text-[rgb(var(--muted-foreground))] text-sm">
                    Common API keys shared across all your projects.
                  </p>
                </div>
              </div>

              {loadingGlobal ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-[rgb(var(--primary))]" />
                </div>
              ) : globalSecrets.length === 0 ? (
                <Card className="border-dashed border-white/10 bg-white/5">
                  <CardContent className="py-10 text-center">
                    <p className="text-slate-500 text-sm">
                      Your Global Vault is empty. Use Quick-Add to store common
                      keys.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {globalSecrets.map((secret) => (
                    <Card
                      key={secret._id}
                      className="border-white/5 bg-[#1a1b26] hover:border-emerald-500/20 transition-all"
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <KeyRound className="h-4 w-4 text-emerald-500" />
                          </div>
                          <div>
                            <h4 className="font-mono text-sm font-bold text-slate-200">
                              {secret.key}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {secret.service && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] uppercase bg-white/5 border-white/5 text-slate-400 py-0 h-4"
                                >
                                  {secret.service}
                                </Badge>
                              )}
                              <p className="text-[10px] text-slate-500">
                                Added{" "}
                                {new Date(
                                  secret.createdAt,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 bg-black/20 rounded font-mono text-xs text-slate-400 min-w-[120px]">
                            {revealedGlobalValues[secret._id] ||
                              "••••••••••••••••"}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-white"
                            onClick={() => handleRevealGlobal(secret._id)}
                          >
                            {revealedGlobalValues[secret._id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-400"
                            onClick={() => handleDeleteGlobal(secret._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Quick-Add Dialog */}
        <Dialog open={showQuickAdd} onOpenChange={setShowQuickAdd}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedService && (
                  <selectedService.icon
                    className={cn("h-5 w-5", selectedService.color)}
                  />
                )}
                Add {selectedService?.name} to Global Vault
              </DialogTitle>
              <DialogDescription>
                Store your {selectedService?.name} key securely in your account
                vault.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleQuickAdd} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-400">
                  {selectedService?.keyName} Value
                </label>
                <div className="relative">
                  <Input
                    type={showQuickAddValue ? "text" : "password"}
                    placeholder={`Paste key here...`}
                    value={quickAddValue}
                    onChange={(e) => setQuickAddValue(e.target.value)}
                    required
                    className="bg-[#12141c] border-white/5 pr-10"
                  />
                  <div className="absolute right-0 top-0 h-full flex items-center pr-3 gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-500 hover:text-slate-300"
                      onClick={() => setShowQuickAddValue(!showQuickAddValue)}
                    >
                      {showQuickAddValue ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Key className="h-4 w-4 text-slate-600" />
                  </div>
                </div>
                <p className="mt-2 text-[10px] text-slate-500">
                  This key will be shared across all your projects securely.
                </p>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowQuickAdd(false)}
                  className="hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addingSecret}
                  className="min-w-[120px] text-white bg-emerald-600 hover:bg-emerald-500"
                >
                  {addingSecret ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Store Key"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Create Token Dialog */}
        <Dialog
          open={showCreate}
          onOpenChange={(open) => {
            setShowCreate(open);
            if (!open) setNewRawToken(null);
          }}
        >
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
                    {copied ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copied ? "Copied!" : "Copy Token"}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Create API Token</DialogTitle>
                  <DialogDescription>
                    Generate a new token for programmatic access.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Token Name
                    </label>
                    <Input
                      placeholder="CI/CD Pipeline"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Project
                    </label>
                    <select
                      value={tokenProjectId}
                      onChange={(e) => setTokenProjectId(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-[rgb(var(--input))] bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--ring))]"
                      required
                    >
                      {projects.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expires In (days)
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      value={expiresInDays}
                      onChange={(e) =>
                        setExpiresInDays(parseInt(e.target.value))
                      }
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowCreate(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={creating}>
                      {creating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Generate"
                      )}
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
