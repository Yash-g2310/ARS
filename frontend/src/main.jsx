import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes/RouteConfig";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";

const root = document.getElementById("root");

const router = createBrowserRouter(routes);

createRoot(root).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </AuthProvider>
  </StrictMode>
);
