import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import "./assets/css/index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AuthContextProvider } from "./context/authContext";

// import { IconContext } from "react-icons";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <ChakraProvider>
          {/* <IconContext.Provider> */}
          {/* <Provider store={store}> */}
          <App />
          {/* </Provider> */}
          {/* </IconContext.Provider> */}
        </ChakraProvider>
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);
