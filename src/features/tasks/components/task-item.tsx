import { memo, useState } from "react";
import {
  Trash2,
  Pencil,
  Calendar,
  Loader2,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { toast } from "sonner";

import { useToggleTask, useDeleteTask } from "@/features/tasks/hooks/use-tasks";
import type { Task } from "@/lib/validations/task";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TaskForm } from "./task-form";

interface TaskItemProps {
  task: Task;
}

const statusConfig = {
  pending: {
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    icon: Circle,
    label: "Pending",
  },
  completed: {
    badge:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    icon: CheckCircle2,
    label: "Completed",
  },
};

export const TaskItem = memo(function TaskItem({ task }: TaskItemProps) {
  const toggleMutation = useToggleTask();
  const deleteMutation = useDeleteTask();
  const [editOpen, setEditOpen] = useState(false);

  const isCompleted = task.status === "completed";
  const StatusIcon = statusConfig[task.status].icon;

  // Quick toggle: works both ways (pending -> completed, completed -> pending)
  const handleToggle = () => {
    if (toggleMutation.isPending) return;

    toggleMutation.mutate(task._id, {
      onSuccess: (data) => {
        const message =
          data.status === "completed"
            ? "Task completed"
            : "Task marked as pending";
        toast.success(message);
      },
      onError: (error) => {
        toast.error("Failed to update status", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
      },
    });
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(task._id);
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const isPending = toggleMutation.isPending || deleteMutation.isPending;

  return (
    <div
      className={`group flex items-start gap-3 p-4 rounded-xl border bg-card transition-all hover:shadow-sm ${
        isCompleted ? "opacity-60" : ""
      }`}
    >
      {/* Toggle Button - Click to toggle status */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className="mt-0.5 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full disabled:opacity-50 transition-transform active:scale-95"
        aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
        title={isCompleted ? "Click to mark as pending" : "Click to complete"}
      >
        <StatusIcon
          className={`h-5 w-5 ${
            isCompleted
              ? "text-green-600 dark:text-green-400"
              : "text-muted-foreground hover:text-primary"
          } transition-colors`}
        />
      </button>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className={`font-semibold text-sm ${
              isCompleted ? "line-through text-muted-foreground" : ""
            }`}
          >
            {task.title}
          </h3>
          <Badge
            variant="secondary"
            className={`text-xs ${statusConfig[task.status].badge}`}
          >
            {task.status}
          </Badge>
        </div>

        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Edit Dialog - Now includes status dropdown */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Change task details or explicitly set its status.
              </DialogDescription>
            </DialogHeader>
            <TaskForm task={task} onClose={() => setEditOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* Delete Alert */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
              >
                {deleteMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
});
