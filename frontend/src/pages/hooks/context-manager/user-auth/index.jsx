import { createContext, useEffect, useReducer } from "react";

export const AuthContext = createContext(null);

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      console.log("logout");
      localStorage.removeItem("userAuth");
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [User, setUser] = useReducer(authReducer, {
    user: localStorage.getItem("userAuth")
      ? JSON.parse(localStorage.getItem("userAuth"))
      : null,
  });

  useEffect(() => {
    var getLocalUser = JSON.parse(localStorage.getItem("userAuth"));

    if (getLocalUser) {
      setUser({ type: "LOGIN", payload: getLocalUser });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...User, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
