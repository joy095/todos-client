import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
  description: z.string().max(500, "Max 500 characters").optional(),
  status: z.enum(["pending", "completed"]).optional(),
});

export const taskUpdateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(["pending", "completed"]).optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;

export interface Task {
  _id: string;
  title: string;
  description: string | null;
  status: "pending" | "completed";
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface TasksResponse {
  success: boolean;
  data: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    q?: string;
    status?: string;
    sortBy: string;
    order: "asc" | "desc";
  };
}
