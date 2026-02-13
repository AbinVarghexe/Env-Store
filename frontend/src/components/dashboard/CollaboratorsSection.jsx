"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Trash2,
  Shield,
  ShieldAlert,
  UserPlus,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

const ROLES = [
  { label: "Admin", value: "admin" },
  { label: "Developer", value: "developer" },
  { label: "Viewer", value: "viewer" },
];

export function CollaboratorsSection({ project, onUpdate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [inviting, setInviting] = useState(null); // userId of user being invited
  const [activeRole, setActiveRole] = useState("developer");

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setSearching(true);
        try {
          const { data } = await api.get(`/auth/search?query=${searchQuery}`);
          setSearchResults(data.users);
        } catch (err) {
          console.error(err);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleInvite = async (user) => {
    setInviting(user._id);
    try {
      await api.post(`/projects/${project._id}/members`, {
        email: user.email,
        role: activeRole,
      });
      setSearchQuery("");
      setSearchResults([]);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to invite member");
    } finally {
      setInviting(null);
    }
  };

  const handleRemove = async (userId) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await api.delete(`/projects/${project._id}/members/${userId}`);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "owner":
        return (
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
            Owner
          </Badge>
        );
      case "admin":
        return (
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            Admin
          </Badge>
        );
      case "developer":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            Developer
          </Badge>
        );
      default:
        return <Badge variant="secondary">Viewer</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Invite Section */}
      <Card className="border-white/5 bg-[#1a1b26] overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-500" />
            Invite Collaborators
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search by email or name..."
              className="pl-9 bg-slate-900/50 border-white/5 text-white placeholder:text-slate-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="mt-2 rounded-lg border border-white/5 bg-[#1f212e] overflow-hidden">
              <div className="p-2 border-b border-white/5 bg-slate-800/20 flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-500 font-bold px-3">
                <span>Set Role:</span>
                <div className="flex gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setActiveRole(r.value)}
                      className={cn(
                        "px-2 py-0.5 rounded transition-colors",
                        activeRole === r.value
                          ? "bg-blue-600 text-white"
                          : "hover:text-white",
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
                      {user.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleInvite(user)}
                    disabled={inviting === user._id}
                    className="bg-blue-600 hover:bg-blue-500"
                  >
                    {inviting === user._id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Invite"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
          {searching && searchQuery.length >= 2 && (
            <div className="mt-2 text-center py-4 text-slate-500 text-xs">
              <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
              Searching...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Members List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Project Members ({project?.members?.length || 0})
        </h3>
        <div className="grid gap-3">
          {project?.members?.map((member) => (
            <Card
              key={member.userId?._id}
              className="border-white/5 bg-[#1a1b26] hover:bg-[#1f212e] transition-colors group"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-800 border-2 border-slate-700/50 flex items-center justify-center text-sm font-bold text-white uppercase">
                    {member.userId?.name?.[0] || "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">
                        {member.userId?.name || "Unknown"}
                      </p>
                      {getRoleBadge(member.role)}
                    </div>
                    <p className="text-xs text-slate-400">
                      {member.userId?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest hidden sm:block">
                    Added {new Date(member.addedAt).toLocaleDateString()}
                  </span>
                  {member.role !== "owner" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(member.userId._id)}
                      className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
