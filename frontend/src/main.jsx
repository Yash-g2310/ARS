import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes/RouteConfig";
import { store, persistor } from './app/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

const root = document.getElementById("root");

const router = createBrowserRouter(routes);

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
