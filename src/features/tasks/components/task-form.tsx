import { useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";

import {
  taskUpdateSchema,
  type TaskInput,
  type Task,
} from "@/lib/validations/task";
import { useCreateTask, useUpdateTask } from "@/features/tasks/hooks/use-tasks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TaskFormProps {
  task?: Task;
  onClose?: () => void;
}

export function TaskForm({ task, onClose }: TaskFormProps) {
  const isEditing = !!task;
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskUpdateSchema) as Resolver<TaskInput>,
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "pending",
    },
  });

  const currentStatus = watch("status");

  const onSubmit = async (data: TaskInput) => {
    try {
      if (isEditing && task) {
        await updateMutation.mutateAsync({ id: task._id, data });
        toast.success("Task updated");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Task created");
        reset();
      }
      onClose?.();
    } catch (error) {
      toast.error("Failed to save task", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="What needs to be done?"
          disabled={isLoading}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Add details..."
          rows={3}
          disabled={isLoading}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Explicit Status Selector */}
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={currentStatus || "pending"}
          onValueChange={(v: "pending" | "completed") => setValue("status", v)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Update Task
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your list. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <TaskForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
