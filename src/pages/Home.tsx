// pages/Home.tsx
import { Link } from "react-router";
import { CheckSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "@/env";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>TaskFlow - Organize Your Tasks Effortlessly</title>

        <meta
          name="description"
          content="A modern task management application to organize, track, and complete your daily tasks efficiently."
        />

        <meta
          name="keywords"
          content="todo app, task manager, productivity, task tracking, task management"
        />

        <meta name="robots" content="index, follow" />

        <link rel="canonical" href={BASE_URL} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TaskFlow" />
        <meta
          property="og:title"
          content="TaskFlow - Organize Your Tasks Effortlessly"
        />
        <meta
          property="og:description"
          content="Manage tasks, boost productivity, and stay organized."
        />
        <meta property="og:url" content={BASE_URL} />
        <meta property="og:image" content={`${BASE_URL}/img/todos.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TaskFlow" />
        <meta
          name="twitter:description"
          content="Manage tasks and boost productivity."
        />
        <meta name="twitter:image" content={`${BASE_URL}/img/todos.png`} />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
        <div className="text-center space-y-6 max-w-lg">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <CheckSquare className="h-8 w-8 text-primary-foreground" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight">TaskFlow</h1>
          <p className="text-lg text-muted-foreground">
            Stay organized, focused, and get things done. The simple todo app
            that just works.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/register">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
