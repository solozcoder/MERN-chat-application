import { Link, Navigate, Outlet } from "react-router-dom";
import { useContext, useState } from "react";
// import { userContext } from "../context/userContext";
import axios from "axios";
import { useAuthContext } from "../hooks/authHook";

const ProtectedRoute = (props) => {
  console.log(props);
  // const { user } = useAuthContext();
  // if (!user) return <Navigate to="/authentication" replace />;
  // return children;
};

export default ProtectedRoute;
