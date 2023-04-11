import React from "react";
import ReactDOM from "react-dom/client";
import App from "./setup/App";
// import "./assets/css/index.css";
// import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AuthContextProvider } from "./pages/hooks/context-manager/user-auth";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <ChakraProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </ChakraProvider>
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);
