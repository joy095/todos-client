import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  ListTodo,
  Loader2,
  Inbox,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
} from "lucide-react";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { useTasks, type TaskFilters } from "@/features/tasks/hooks/use-tasks";
import { TaskItem } from "@/features/tasks/components/task-item";
import { CreateTaskDialog } from "@/features/tasks/components/task-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SuggestionsDropdown } from "@/features/tasks/components/task-search-suggestions";
import { SEO } from "@/components/seo";
import { BASE_URL } from "@/env";

const LIMIT = 10;

export default function TodosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const initialFilters: TaskFilters = {
    page: Number(searchParams.get("page")) || 1,
    limit: LIMIT,
    q: searchParams.get("q") || undefined,
    status: (searchParams.get("status") as TaskFilters["status"]) || "all",
    sortBy: searchParams.get("sortBy") || "createdAt",
    order: (searchParams.get("order") as TaskFilters["order"]) || "desc",
  };

  const [filters, setFilters] = useState<TaskFilters>(initialFilters);
  const [searchInput, setSearchInput] = useState(initialFilters.q ?? "");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data, isLoading: tasksLoading } = useTasks(filters);

  // Sync URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.page && filters.page > 1)
      params.set("page", String(filters.page));
    if (filters.q) params.set("q", filters.q);
    if (filters.status && filters.status !== "all")
      params.set("status", filters.status);
    if (filters.sortBy && filters.sortBy !== "createdAt")
      params.set("sortBy", filters.sortBy);
    if (filters.order && filters.order !== "desc")
      params.set("order", filters.order);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const updateFilter = useCallback(
    <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    },
    [],
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const q = formData.get("q") as string;
      updateFilter("q", q.trim() || undefined);
    },
    [updateFilter],
  );

  const clearSearch = () => {
    updateFilter("q", undefined);
  };

  const goToPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pagination = data?.pagination;

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Inbox className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">
          Please sign in to manage your tasks
        </p>
        <Button asChild>
          <a href="/login">Sign in</a>
        </Button>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="My Tasks | TaskFlow"
        description="Create, edit, search, filter, and manage all your tasks in one place."
        noIndex
        image={`${BASE_URL}/img/todos.png`}
        url={`${BASE_URL}`}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ListTodo className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
              <p className="text-sm text-muted-foreground">
                {pagination?.total ?? 0} total tasks
              </p>
            </div>
          </div>
          <CreateTaskDialog />
        </div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <form onSubmit={handleSearch}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                name="q"
                value={searchInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchInput(value);

                  setShowSuggestions(value.trim().length >= 2);
                }}
                onFocus={() =>
                  searchInput.trim().length >= 2 && setShowSuggestions(true)
                }
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 150);
                }}
                placeholder="Search tasks..."
                className="pl-10 pr-10"
              />

              {filters.q && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>

            <SuggestionsDropdown
              open={showSuggestions}
              query={searchInput}
              onSelect={(value) => {
                setSearchInput(value);
                updateFilter("q", value);
                setShowSuggestions(false);
              }}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Select
              value={`${filters.sortBy}-${filters.order}`}
              onValueChange={(v) => {
                const [sortBy, order] = v.split("-") as [
                  string,
                  "asc" | "desc",
                ];
                updateFilter("sortBy", sortBy);
                updateFilter("order", order);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest first</SelectItem>
                <SelectItem value="createdAt-asc">Oldest first</SelectItem>
                <SelectItem value="title-asc">Title A-Z</SelectItem>
                <SelectItem value="title-desc">Title Z-A</SelectItem>
                <SelectItem value="updatedAt-desc">Recently updated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs
          value={filters.status || "all"}
          onValueChange={(v) =>
            updateFilter("status", v as TaskFilters["status"])
          }
        >
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="all">
              All
              {pagination?.total !== undefined && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {pagination.total}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Task List */}
        <div className="space-y-3">
          {tasksLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : data?.data && data.data.length > 0 ? (
            data.data.map((task) => <TaskItem key={task._id} task={task} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl border-muted">
              <Inbox className="h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="font-semibold text-muted-foreground">
                No tasks found
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {filters.q
                  ? `No results for "${filters.q}"`
                  : filters.status !== "all"
                    ? `No ${filters.status} tasks`
                    : "Get started by creating your first task"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={!pagination.hasPrev || tasksLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first, last, current, and neighbors
                    const current = pagination.page;
                    return (
                      page === 1 ||
                      page === pagination.totalPages ||
                      Math.abs(page - current) <= 1
                    );
                  })
                  .map((page, idx, arr) => (
                    <div key={page} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={
                          page === pagination.page ? "default" : "outline"
                        }
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => goToPage(page)}
                        disabled={tasksLoading}
                      >
                        {page}
                      </Button>
                    </div>
                  ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.page + 1)}
                disabled={!pagination.hasNext || tasksLoading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
