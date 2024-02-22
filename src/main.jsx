import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import {fbconfig }from "./fbconfig.js";
import { initializeApp } from "firebase/app";
import { AuthContext } from "./Context/AuthContext.jsx";
import  {PostsProvider}  from './Context/PostsContext';
import {getFirestore} from 'firebase/firestore'

const app = initializeApp(fbconfig);
export const database = getFirestore(app)


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PostsProvider>
    <AuthContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthContext>
    </PostsProvider>
  </React.StrictMode>
);
