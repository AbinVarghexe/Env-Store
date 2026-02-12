"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  delay = 0,
}) {
  const valueRef = useRef(null);

  useEffect(() => {
    const el = valueRef.current;
    if (!el) return;

    // cleanup previous animation if any (though unlikely in this simple case)
    gsap.killTweensOf(el);

    // Use a proxy object for the counter
    const proxy = { val: 0 };
    const numericValue =
      parseInt(String(value).replace(/[^0-9]/g, ""), 10) || 0;

    gsap.fromTo(
      proxy,
      { val: 0 },
      {
        val: numericValue,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          if (el) {
            el.innerText = Math.ceil(proxy.val).toLocaleString();
          }
        },
      },
    );
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden border-t-4 border-t-[rgb(var(--primary))] bg-[rgb(var(--card))] shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[rgb(var(--muted-foreground))] mb-1">
                {title}
              </p>
              <h3
                ref={valueRef}
                className="text-3xl font-bold text-[rgb(var(--foreground))]"
              >
                0
              </h3>
            </div>
            <div className="p-3 bg-[rgb(var(--primary))/0.1] rounded-xl">
              <Icon className="h-6 w-6 text-[rgb(var(--primary))]" />
            </div>
          </div>
          {trend && (
            <div className="mt-4 flex items-center text-xs font-medium">
              <span
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full bg-opacity-20",
                  trendUp
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-rose-500 bg-rose-500/10",
                )}
              >
                {trend}
              </span>
              <span className="ml-2 text-[rgb(var(--muted-foreground))]">
                from last month
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
