"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/projects");
      setProjects(data.projects);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (name, description) => {
    const { data } = await api.post("/projects", { name, description });
    setProjects((prev) => [data.project, ...prev]);
    return data.project;
  };

  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  return { projects, loading, error, fetchProjects, createProject, deleteProject };
}
