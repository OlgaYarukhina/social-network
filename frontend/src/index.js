import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./styles.css";
import App from "./App";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import User from "./components/User";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: "/register", element: <Register /> },
            { path: "/login", element: <Login /> },
            { path: "/user/:userId", element: <User /> },
        ],
    },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
