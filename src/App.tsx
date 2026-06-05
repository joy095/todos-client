import { Routes, Route, Navigate } from "react-router";

import { Layout } from "./components/layout/layout";
import { ProtectedRoute } from "./components/protected-route";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUpPage from "./pages/Signup";
import TodosPage from "./pages/Todos";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUpPage />} />

      {/* Protected routes inside Layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<TodosPage />} />
        <Route path="/dashboard" element={<TodosPage />} />
      </Route>

      {/* Public landing page (outside layout) */}
      <Route path="/home" element={<Home />} />

      {/* Redirect root to todos if accessing directly without layout */}
      <Route path="/" element={<Navigate to="/todos" replace />} />

      {/* 404 catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
