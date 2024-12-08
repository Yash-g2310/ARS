import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes/RouteConfig";
import { store } from './app/store'
import { Provider } from 'react-redux'

const root = document.getElementById("root");

const router = createBrowserRouter(routes);

createRoot(root).render(
  <StrictMode>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
  </StrictMode>
);
