// import RouteManager from "./routes-manager";
import axios from "axios";
import { useEffect } from "react";
import { Routes, Route, Link, Navigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuthContext } from "../pages/hooks/user-hooks";
import MainIndex from "../pages/main";
import MainAuth from "./auth/Index";
const socket = io(import.meta.env.VITE_API_BASE_URL);

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

const App = () => {
  const { user, setUser } = useAuthContext();

  useEffect(() => {
    if (user) {
      socket.emit("setup", user);
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <Navigate to="/authentication" />
            ) : (
              <MainIndex socket={socket} />
            )
          }
        />

        <Route
          path="/authentication"
          element={user ? <Navigate to="/" /> : <MainAuth socket={socket} />}
        />
      </Routes>
      {/* <RouteManager socket={socket} /> */}
    </div>
  );
};

export default App;
