import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export function useStats() {
  const [stats, setStats] = useState({
    totalSecrets: 0,
    activeApiKeys: 0,
    teamMembers: 0,
    usageHistory: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/stats");
      setStats(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
