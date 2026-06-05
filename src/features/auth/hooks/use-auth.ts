import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export function useAuth() {
  const {
    data: session,
    isPending,
    error,
  } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const result = await authClient.getSession();
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  return {
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
    isLoading: isPending,
    error,
  };
}
