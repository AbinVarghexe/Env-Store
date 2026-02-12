"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";

const data = [
  { name: "Mon", requests: 400 },
  { name: "Tue", requests: 300 },
  { name: "Wed", requests: 550 },
  { name: "Thu", requests: 450 },
  { name: "Fri", requests: 700 },
  { name: "Sat", requests: 200 },
  { name: "Sun", requests: 350 },
];

export function UsageChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Card className="h-full border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Secrets Usage</CardTitle>
              <CardDescription>Access requests over time</CardDescription>
            </div>
            <div className="text-sm text-[rgb(var(--muted-foreground))] border px-3 py-1 rounded-md bg-[rgb(var(--background))]">
              Last 7 days
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorRequests"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="rgb(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="rgb(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgb(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  stroke="rgb(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgb(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(var(--popover))",
                    borderColor: "rgb(var(--border))",
                    borderRadius: "8px",
                    color: "rgb(var(--popover-foreground))",
                  }}
                  itemStyle={{
                    color: "rgb(var(--primary))",
                  }}
                  cursor={{
                    stroke: "rgb(var(--muted-foreground))",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="rgb(var(--primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRequests)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
