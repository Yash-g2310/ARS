import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes/RouteConfig";
import { AuthProvider } from "./context/AuthContext";

const root = document.getElementById("root");

const router = createBrowserRouter(routes);

createRoot(root).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
