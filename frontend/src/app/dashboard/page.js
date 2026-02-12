"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, FolderKey, Loader2, Key, Users, Lock, Search } from "lucide-react";
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
import { StatCard } from "@/components/dashboard/StatCard";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ProjectCard } from "@/components/dashboard/ProjectCard";


export default function DashboardPage() {
  const { user } = useAuth();
  const { projects, loading, createProject, deleteProject } = useProjects();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state for search
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
    try {
      await deleteProject(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      {/* Background Effect */}


      <div className="relative z-10 max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
            <p className="text-[rgb(var(--muted-foreground))] text-sm">
              Welcome back, {user?.name}. Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--muted-foreground))]" />
              <Input 
                placeholder="Search projects..." 
                className="pl-9 bg-[rgb(var(--card))]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button onClick={() => setShowCreate(true)} className="bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))/0.9]">
              <Plus className="h-4 w-4 mr-2" /> New Project
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Secrets"
            value="1,248"
            icon={Lock}
            trend="+12%"
            trendUp={true}
            delay={0}
          />
          <StatCard
            title="Active API Keys"
            value="86"
            icon={Key}
            trend="98.5%"
            trendUp={true}
            delay={0.1}
          />
          <StatCard
            title="Team Members"
            value="24"
            icon={Users}
            trend="+3"
            trendUp={true}
            delay={0.2}
          />
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
          <div className="lg:col-span-2 h-full">
            <UsageChart />
          </div>
          <div className="lg:col-span-1 h-full">
            <RecentActivity />
          </div>
        </div>

        {/* Active Projects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Active Projects</h2>
            <Button variant="ghost" size="sm" asChild>
              <a href="#" className="text-[rgb(var(--primary))]">See all projects</a>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[rgb(var(--primary))]" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-[rgb(var(--card))]/50 rounded-xl border border-dashed border-[rgb(var(--border))]">
              <FolderKey className="h-12 w-12 text-[rgb(var(--muted-foreground))] mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-[rgb(var(--muted-foreground))] text-sm mb-6">
                {searchQuery ? "Try a different search term." : "Create your first project to get started."}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowCreate(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Create Project
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, i) => (
                <ProjectCard 
                  key={project._id} 
                  project={project} 
                  index={i}
                  onDelete={setDeleteId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Create Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                A new project with Development, Staging, and Production environments.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Name</label>
                <Input
                  placeholder="My SaaS App"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                <Input
                  placeholder="A brief description"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
              <DialogDescription>
                This will permanently delete the project and all its secrets. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="ghost" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
