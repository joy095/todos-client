import { Link } from "react-router";
import { CheckSquare, Menu, LogOut, Loader2 } from "lucide-react";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { useSignOut } from "@/features/auth/hooks/use-signout";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserAvatar } from "../user-avatar";

export function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const signOutMutation = useSignOut();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-hover:shadow-md transition-shadow">
            <CheckSquare className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:inline">
            TaskFlow
          </span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : isAuthenticated && user ? (
            <>
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="flex flex-col gap-6 pt-6">
                    <div className="flex items-center gap-3 px-2">
                      <UserAvatar
                        name={user.name}
                        image={user.image}
                        className="h-10 w-10"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {user.name || "User"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <Button
                      variant="destructive"
                      className="w-full gap-2"
                      onClick={() => signOutMutation.mutate()}
                      disabled={signOutMutation.isPending}
                    >
                      {signOutMutation.isPending && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* User Dropdown (Desktop) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0 hover:bg-accent"
                  >
                    <UserAvatar
                      name={user.name}
                      image={user.image}
                      className="h-8 w-8"
                    />
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={user.name}
                        image={user.image}
                        className="h-10 w-10"
                      />
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-semibold">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                    onClick={() => signOutMutation.mutate()}
                    disabled={signOutMutation.isPending}
                  >
                    {signOutMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Get started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
