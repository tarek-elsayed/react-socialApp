import { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Register from "./Auth/Register/Register";
import Login from "./Auth/Login/Login";
import NotFound from "./Components/NotFound/NotFound";
import UserContextProvider from "./Context/UserContext";
import Profile from "./Components/Profile/Profile";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import AuthRoute from "./Components/AuthRoute/AuthRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostDetails from "./Components/PostDetails/PostDetails";

function App() {
  let router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { path: "home", element: <ProtectedRoute><Home /> </ProtectedRoute>},
        { path: "postDetails/:id", element: <ProtectedRoute><PostDetails /> </ProtectedRoute>},
        { path: "profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
        { index: true, element: <AuthRoute><Register /></AuthRoute> },
        { path: "login", element: <AuthRoute><Login /></AuthRoute> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  const query = new QueryClient();


  return (
    <>
    <QueryClientProvider client={query}>
      <UserContextProvider>
        <RouterProvider router={router}></RouterProvider>
      </UserContextProvider>
    </QueryClientProvider>
    </>
  );
}

export default App;
