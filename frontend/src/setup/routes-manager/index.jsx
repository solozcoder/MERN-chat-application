// Route
import { Routes, Route, Link, Navigate, useParams } from "react-router-dom";
import ProtectedRoute from "./protected-route";

// Page
import MainIndex from "../../pages/main";
import MainAuth from "../auth/Index";
import ChatManager from "../../pages/chat-manager";
import { useAuthContext } from "../../pages/hooks/user-hooks";

const RouteManager = ({ socket }) => {
  const { user, setUser } = useAuthContext();
  return (
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
        path="/chat/:userId"
        element={
          !user ? (
            <Navigate to="/authentication" />
          ) : (
            <ChatManager socket={socket} />
          )
        }
      />

      {/* <Route
        path="/authentication"
        element={user ? <Navigate to="/" /> : <MainAuth socket={socket} />}
      /> */}
      {/* <Route path="*" element={<MainIndex socket={socket} />} /> */}
    </Routes>
  );
};

export default RouteManager;
