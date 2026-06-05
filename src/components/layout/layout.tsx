import { Outlet } from "react-router";
import { Header } from "./header";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}
