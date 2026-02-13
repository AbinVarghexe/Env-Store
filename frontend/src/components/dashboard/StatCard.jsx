import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  className,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/5 bg-[#1a1b26] p-6 shadow-xl",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white">{value}</h3>
          </div>
          {trend && (
            <div className="mt-2 flex items-center gap-2">
              <span
                className={cn(
                  "text-xs font-medium",
                  trendUp ? "text-emerald-400" : "text-rose-400",
                )}
              >
                {trend}
              </span>
              <span className="text-xs text-slate-500">from last month</span>
            </div>
          )}
        </div>
        <div className={cn("rounded-lg p-2.5", "bg-white/5 text-white")}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {/* Background Gradient Glow */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all duration-500 group-hover:bg-blue-500/20" />
    </motion.div>
  );
}
