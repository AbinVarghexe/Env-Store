import Link from "next/link";
import { ArrowRight, FolderKey, Trash2 } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Helper functions (shared)
const formatDate = (dateString) => {
  if (!dateString) return "Never";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch (e) {
    return "Unknown";
  }
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Grid View Component
function ProjectGridCard({ project, onDelete, index }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const secretCount = project.secretCount || 0;
  const status = "Active";
  const statusColor = "text-emerald-400 bg-emerald-400/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000 h-full"
    >
      <Link
        href={`/dashboard/projects/${project._id}`}
        className="block h-full"
      >
        <Card className="h-full group relative overflow-hidden border border-white/5 bg-[#1a1b26] transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <CardContent className="p-6 relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/20">
                {getInitials(project.name)}
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "border-0 px-2.5 py-0.5 text-xs font-medium",
                  statusColor,
                )}
              >
                {status}
              </Badge>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-slate-400 mb-6 line-clamp-2 grow">
              {project.description || "No description provided."}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Secrets
                </p>
                <p className="mt-1 text-lg font-medium text-white">
                  {secretCount}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  Last Sync
                </p>
                <p className="mt-1 text-lg font-medium text-white">
                  {formatDate(project.updatedAt)}
                </p>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex -space-x-2">
                {project.members &&
                  project.members.slice(0, 3).map((m, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#1a1b26] bg-slate-700 text-xs text-white"
                    >
                      {m.userId?.name ? m.userId.name[0].toUpperCase() : "U"}
                    </div>
                  ))}
                {project.members && project.members.length > 3 && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#1a1b26] bg-slate-800 text-xs text-slate-400">
                    +{project.members.length - 3}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(project._id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white/5 text-white group-hover:bg-blue-600 transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// List View Component
function ProjectListCard({ project, onDelete }) {
  const secretCount = project.secretCount || 0;
  const status = "Active";
  const statusColor = "text-emerald-400 bg-emerald-400/10";

  return (
    <Link href={`/dashboard/projects/${project._id}`} className="block">
      <Card className="group relative overflow-hidden border border-white/5 bg-[#1a1b26] transition-all hover:bg-[#1f212e] hover:border-blue-500/30">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/20">
            {getInitials(project.name)}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
              {project.name}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              Production
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                  statusColor,
                )}
              >
                {status}
              </span>
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <div className="text-right w-20">
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider">
                Secrets
              </span>
              <span className="text-white font-medium text-sm">
                {secretCount}
              </span>
            </div>
            <div className="text-right w-24">
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider">
                Synced
              </span>
              <span className="text-white font-medium text-sm">
                {formatDate(project.updatedAt)}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center -space-x-2 px-4 border-l border-white/5">
            {project.members &&
              project.members.slice(0, 3).map((m, i) => (
                <div
                  key={i}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#1a1b26] bg-slate-700 text-[10px] text-white"
                >
                  {m.userId?.name ? m.userId.name[0].toUpperCase() : "U"}
                </div>
              ))}
            {project.members && project.members.length > 3 && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#1a1b26] bg-slate-800 text-[10px] text-slate-400">
                +{project.members.length - 3}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(project._id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <ArrowRight className="h-5 w-5 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-blue-400 shrink-0" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Main Component
export function ProjectCard({ project, view = "grid", onDelete, index }) {
  if (view === "list") {
    return <ProjectListCard project={project} onDelete={onDelete} />;
  }
  return (
    <ProjectGridCard project={project} onDelete={onDelete} index={index} />
  );
}
