import { createRoot } from "react-dom/client";
import "the-new-css-reset/css/reset.css";
import "./index.css";
import App from "./App.tsx";
import { DataProvider } from "./context.tsx";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  
    <DataProvider>
      <App />
    </DataProvider>
  
);
