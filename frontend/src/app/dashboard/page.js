"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  FolderKey,
  Loader2,
  Lock,
  Search,
  KeyRound,
  Users,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { useStats } from "@/hooks/useStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { UsageChart } from "@/components/dashboard/UsageChart";

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects, loading, createProject, deleteProject } = useProjects();
  const { stats, loading: statsLoading } = useStats();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState(null); // Use this for delete dialog
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  // Load view preference
  useEffect(() => {
    const saved = localStorage.getItem("dashboardViewMode");
    if (saved) setViewMode(saved);
  }, []);

  const toggleView = (mode) => {
    setViewMode(mode);
    localStorage.setItem("dashboardViewMode", mode);
  };

  // Derived state for search
  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createProject(newName, newDesc);
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProject(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="relative z-10 max-w-[1600px] mx-auto space-y-8 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 text-white">
              Dashboard Overview
            </h1>
            <p className="text-slate-400 text-sm">
              Welcome back, {user?.name}. Here&apos;s what&apos;s happening
              today.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search projects..."
                className="pl-9 bg-[#1a1b26] border-white/5 text-white placeholder:text-slate-500 focus:ring-blue-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              onClick={() => setShowCreate(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white shrink-0"
            >
              <Plus className="h-4 w-4 mr-2" /> New Project
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Secrets"
            value={stats.totalSecrets.toLocaleString()}
            icon={Lock}
            trend="+12%"
            trendUp={true}
            delay={0}
            className="border-l-4 border-l-blue-500"
          />
          <StatCard
            title="Active API Keys"
            value={stats.activeApiKeys.toLocaleString()}
            icon={KeyRound}
            trend="98.5%"
            trendUp={true}
            delay={0.1}
            className="border-l-4 border-l-emerald-500"
          />
          <StatCard
            title="Team Members"
            value={stats.teamMembers.toLocaleString()}
            icon={Users}
            trend="+3"
            trendUp={true}
            delay={0.2}
            className="border-l-4 border-l-purple-500"
          />
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[450px]">
            <UsageChart data={stats.usageHistory} />
          </div>
          <div className="lg:col-span-1 h-[450px]">
            <RecentActivity />
          </div>
        </div>

        {/* Active Projects */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white">Active Projects</h2>
              <div className="flex items-center gap-1 bg-[#1a1b26]/50 p-0.5 rounded-md border border-white/5">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 rounded-sm ${viewMode === "grid" ? "bg-blue-600/20 text-blue-400" : "text-slate-500 hover:text-slate-300"}`}
                  onClick={() => toggleView("grid")}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 rounded-sm ${viewMode === "list" ? "bg-blue-600/20 text-blue-400" : "text-slate-500 hover:text-slate-300"}`}
                  onClick={() => toggleView("list")}
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a
                href="#"
                className="text-blue-400 hover:text-blue-300 hover:bg-transparent"
              >
                See all projects
              </a>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-[#1a1b26] rounded-xl border border-dashed border-white/5">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50 mb-4">
                <FolderKey className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No projects found
              </h3>
              <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                {searchQuery
                  ? "Try a different search term to find what you're looking for."
                  : "Create your first project to start managing environment variables securely."}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setShowCreate(true)}
                  className="bg-blue-600 hover:bg-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" /> Create Project
                </Button>
              )}
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-3"
              }
            >
              {filteredProjects.map((project, i) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  index={i}
                  view={viewMode}
                  onDelete={setDeleteId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Create Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="bg-[#1a1b26] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription className="text-slate-400">
                A new project will be initialized with Development, Staging, and
                Production environments.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Project Name
                </label>
                <Input
                  placeholder="My SaaS App"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-slate-900 border-white/5 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Description (optional)
                </label>
                <Input
                  placeholder="A brief description"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="bg-slate-900 border-white/5 text-white"
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreate(false)}
                  className="hover:bg-white/5 text-slate-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="bg-blue-600 hover:bg-blue-500"
                >
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog
          open={!!deleteId}
          onOpenChange={(open) => !open && setDeleteId(null)}
        >
          <DialogContent className="bg-[#1a1b26] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
              <DialogDescription className="text-slate-400">
                This will permanently delete the project and all its secrets.
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                variant="ghost"
                onClick={() => setDeleteId(null)}
                className="hover:bg-white/5 text-slate-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 border border-red-500/20"
              >
                Delete Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
