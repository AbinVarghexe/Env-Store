"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";

export function useSecrets(projectId, envId) {
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSecrets = useCallback(async () => {
    if (!projectId || !envId) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/projects/${projectId}/environments/${envId}/secrets`);
      setSecrets(data.secrets);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load secrets");
    } finally {
      setLoading(false);
    }
  }, [projectId, envId]);

  const createSecret = async (key, value) => {
    const { data } = await api.post(
      `/projects/${projectId}/environments/${envId}/secrets`,
      { key, value }
    );
    setSecrets((prev) => [...prev, data.secret]);
    return data.secret;
  };

  const updateSecret = async (secretId, value) => {
    const { data } = await api.put(
      `/projects/${projectId}/environments/${envId}/secrets/${secretId}`,
      { value }
    );
    setSecrets((prev) =>
      prev.map((s) => (s._id === secretId ? { ...s, ...data.secret } : s))
    );
    return data.secret;
  };

  const deleteSecret = async (secretId) => {
    await api.delete(`/projects/${projectId}/environments/${envId}/secrets/${secretId}`);
    setSecrets((prev) => prev.filter((s) => s._id !== secretId));
  };

  const revealSecret = async (secretId) => {
    const { data } = await api.get(
      `/projects/${projectId}/environments/${envId}/secrets/${secretId}/reveal`
    );
    return data.value;
  };

  return {
    secrets,
    loading,
    error,
    fetchSecrets,
    createSecret,
    updateSecret,
    deleteSecret,
    revealSecret,
  };
}
