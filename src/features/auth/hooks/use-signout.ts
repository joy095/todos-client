// features/auth/hooks/use-signout.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function useSignOut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authClient.signOut();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-session"] });
      queryClient.clear();

      toast.success("Signed out", {
        description: "You have been successfully signed out.",
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 300);
    },
    onError: (error) => {
      toast.error("Sign out failed", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    },
  });
}
