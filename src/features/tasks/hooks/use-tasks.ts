import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import type {
  TaskInput,
  TaskUpdateInput,
  TasksResponse,
} from "@/lib/validations/task";

const TASKS_KEY = ["tasks"] as const;

const SUGGESTIONS_KEY = ["task-suggestions"] as const;

export interface TaskFilters {
  page?: number;
  limit?: number;
  q?: string;
  status?: "all" | "pending" | "completed";
  sortBy?: string;
  order?: "asc" | "desc";
}

export function useTasks(filters: TaskFilters = {}) {
  const {
    page = 1,
    limit = 10,
    q,
    status,
    sortBy = "createdAt",
    order = "desc",
  } = filters;

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", String(limit));
  if (q) queryParams.set("q", q);
  if (status && status !== "all") queryParams.set("status", status);
  queryParams.set("sortBy", sortBy);
  queryParams.set("order", order);

  return useQuery({
    queryKey: [...TASKS_KEY, filters],
    queryFn: () =>
      apiFetch<TasksResponse>(`/api/tasks?${queryParams.toString()}`),
    staleTime: 30 * 1000,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TaskInput) =>
      apiFetch<{ success: boolean; taskId: string }>("/api/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskUpdateInput }) =>
      apiFetch<{ success: boolean; message: string }>(`/api/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ success: boolean; message: string }>(`/api/tasks/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<{ success: boolean; status: "pending" | "completed" }>(
        `/api/tasks/${id}/toggle`,
        { method: "PATCH" },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
    onError: (error) => {
      console.error("Toggle task error:", error);
    },
  });
}

export function useTaskSuggestions(query: string) {
  return useQuery<string[]>({
    queryKey: [...SUGGESTIONS_KEY, query],

    queryFn: () =>
      apiFetch<string[]>(
        `/api/tasks/suggestions?q=${encodeURIComponent(query)}`,
      ),

    enabled: query.trim().length >= 2,

    staleTime: 1000 * 60 * 5,
  });
}
