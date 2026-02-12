"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FolderKey, ArrowRight, Trash2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, onDelete, index }) {
  // Kinetic tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x);
  const mouseY = useSpring(y);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

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

  const statusColor =
    project.secretsCount > 0
      ? "bg-emerald-500/10 text-emerald-500"
      : "bg-[rgb(var(--muted))]/50 text-[rgb(var(--muted-foreground))]";
  const statusText = project.secretsCount > 0 ? "Active" : "Inactive";

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
      className="perspective-1000"
    >
      <Card className="h-full group relative overflow-hidden border-[rgb(var(--border))]/50 bg-[rgb(var(--card))]/50 backdrop-blur-sm transition-all duration-300 hover:border-[rgb(var(--primary))]/30 hover:shadow-xl hover:shadow-[rgb(var(--primary))]/5">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--primary))]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gradient-to-br from-[rgb(var(--primary))] to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <FolderKey className="h-6 w-6 text-white" />
            </div>
            <Badge
              variant="outline"
              className={cn("border-0 font-medium", statusColor)}
            >
              {statusText}
            </Badge>
          </div>

          <h3 className="text-xl font-bold mb-1 tracking-tight">
            {project.name}
          </h3>
          <p className="text-sm text-[rgb(var(--muted-foreground))] mb-6 line-clamp-2 h-10">
            {project.description || "No description provided."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <span className="text-xs text-[rgb(var(--muted-foreground))]">
                Secrets
              </span>
              <p className="text-lg font-semibold">
                {project.secretsCount || 0}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-[rgb(var(--muted-foreground))]">
                Last Synced
              </span>
              <p className="text-lg font-semibold text-sm flex items-center gap-1">
                {new Date(project.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[rgb(var(--border))]/50">
            <div className="flex -space-x-2">
              {project.members?.slice(0, 3).map((m, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-[rgb(var(--background))] border-2 border-[rgb(var(--card))] flex items-center justify-center text-xs font-bold ring-2 ring-transparent"
                >
                  {m.userId?.name?.[0] || "U"}
                </div>
              )) || (
                <div className="w-8 h-8 rounded-full bg-[rgb(var(--background))] border-2 border-[rgb(var(--card))] flex items-center justify-center text-xs font-bold text-[rgb(var(--muted-foreground))]">
                  +1
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project._id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Link href={`/dashboard/projects/${project._id}`}>
                <Button
                  size="sm"
                  className="group/btn relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Open{" "}
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
