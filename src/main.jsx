import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Timer from "./context/Timer.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
     <Timer>

      <App />
     </Timer>
    
  </StrictMode>
);
