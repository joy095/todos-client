import type { ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { HelmetProvider } from "react-helmet-async";

const ONE_MINUTE = 1000 * 60;
const FIVE_MINUTES = ONE_MINUTE * 5;
const TEN_MINUTES = ONE_MINUTE * 10;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes. During this time,
      // React Query won't trigger background refetches for the same query key.
      staleTime: FIVE_MINUTES,

      // Unused cache data is kept in memory for 10 minutes before garbage collection.
      gcTime: TEN_MINUTES,

      // Only retry failed requests once before showing an error.
      // Prevents spamming API when a server error occurs.
      retry: 1,

      // Automatically refetch stale data when the user refocuses the browser window.
      refetchOnWindowFocus: true,

      // Automatically refetch stale data when network connection is restored.
      refetchOnReconnect: true,

      // If a component unmounts and remounts, don't refetch if data isn't stale.
      refetchOnMount: false,
    },

    // Global configurations for modifying data (POST/PUT/DELETE)
    mutations: {
      // Avoid retrying mutations automatically to prevent accidental duplicate writes.
      retry: false,
    },
  },

  // Optional: Global caches for tracking errors or performance metrics
  queryCache: new QueryCache({
    onError: (error) => {
      // Global error handler for queries (e.g., trigger a toast notification)
      console.error(`Global Query Error: ${error.message}`);
    },
  }),

  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      // Automatically invalidate related queries globally on successful mutations
      // if you tag them with a common mutation key meta property.
      const meta = mutation.meta as
        | { invalidateQueries?: string[] }
        | undefined;
      if (meta?.invalidateQueries) {
        queryClient.invalidateQueries({
          queryKey: meta.invalidateQueries,
        });
      }
    },
    onError: (error) => {
      // Global error handler for mutations
      console.error(`Global Mutation Error: ${error.message}`);
    },
  }),
});

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <Toaster position="top-center" richColors closeButton />
          {children}
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
};
