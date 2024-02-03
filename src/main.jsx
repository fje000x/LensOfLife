import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import fbconfig from "./fbconfig.js";
import { initializeApp } from "firebase/app";
import { AuthContext } from "./Context/AuthContext.jsx";
const app = initializeApp(fbconfig);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthContext>
  </React.StrictMode>
);
