// react
import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Link, Navigate, useParams } from "react-router-dom";

// redux
// import { useDispatch, useSelector } from "react-redux";
// import { setAuthUser } from "./redux/slice/userAuth";

// link
import "./assets/css/App.css";

// component
import Chat from "./components/Chat";
import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";
import { useAuthContext } from "./hooks/authHook";
import AuthUser from "./components/Authentication/Index";
import Conversation from "./components/Conversation";

// Socket
import io from "socket.io-client";

// const socket = io.connect("/");

// module
// import jwtDecode from "jwt-decode";
const socket = io("http://localhost:5000", {
  withCredentials: true,
});

function App() {
  const { user, setUser } = useAuthContext();
  // const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      socket.emit("setup", user);
    }
  }, []);

  // const asdf = useMemo(() => {

  // }, []);
  // const [User, setUser] = useState({
  //   _id: "",
  // });

  // useEffect(() => {
  //   var isUser = localStorage.getItem("userInfo");

  //   if (isUser) {
  //     setUser(() => JSON.parse(isUser));
  //   }

  //   console.log("run");
  // }, [User._id]);

  // const providerUser = useMemo(() => ({ User, setUser }), [User, setUser]);
  // const getUser = useSelector((state) => state.userAuth.user);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   var objUser = JSON.parse(localStorage.getItem("userAuth"));
  //   if (objUser) {
  //     dispatch(setAuthUser(objUser));
  //   }
  // }, []);

  // useMemo(() => {

  // },);

  {
    /*

    // Google auth implement
    const handleCallback = (response) => {
      // console.log("Encoded JWT ID token: " + response.credential);
      var userObj = jwtDecode(response.credential);
      dispatch(setUser(userObj));
    };

    useEffect(() => {
      // global google
      return () => {
        google.accounts.id.initialize({
          client_id:
            "584918519595-p53f9ou8lkvsrcqk6au5hsm7ooqbkm5o.apps.googleusercontent.com",
          callback: handleCallback,
        });

        google.accounts.id.renderButton(document.getElementById("signInDiv"), {
          theme: "outline",
          size: "large",
        });
      };
    }, []);

    */
  }

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            user ? <Chat socket={socket} /> : <Navigate to="/authentication" />
          }
        />
        <Route
          path="/authentication"
          element={!user ? <AuthUser /> : <Navigate to="/" />}
        />
        <Route
          path="/chat/:userId"
          element={
            user ? (
              <Conversation socket={socket} />
            ) : (
              <Navigate to="/authentication" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
