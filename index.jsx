import "../global.css";
import "../styleguide.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HomePage } from "./screens/HomePage";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <HomePage />
  </StrictMode>,
);
