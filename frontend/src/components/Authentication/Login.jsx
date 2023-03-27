import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/authHook";
// import {
//   useGetUserQuery,
//   usePostLoginMutation,
// } from "../../redux/slice/AuthSlice";

// import { useHistory } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const toast = useToast();

  const EmailRef = useRef("");
  const PasswordRef = useRef("");

  const navigate = useNavigate();

  // const [data, setData] = useState("");
  // const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuthContext();

  const LoginHandler = async () => {
    try {
      setLoading(true);

      const fetchLogin = await axios({
        url: "http://localhost:5000/api/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: EmailRef.current.value,
          password: PasswordRef.current.value,
        },
        withCredentials: true,
      });

      toast({
        title: "Login Successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });

      setUser({ type: "LOGIN", payload: fetchLogin.data.userAuth });
      localStorage.setItem(
        "userAuth",
        JSON.stringify(fetchLogin.data.userAuth)
      );
      setLoading(false);
      navigate("/");
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: err.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="10px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          ref={EmailRef}
          id="login-email"
          type="email"
          placeholder="Enter Your Email Address"
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            ref={PasswordRef}
            id="login-password"
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() =>
                setShow((prev) => {
                  return !prev;
                })
              }
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        variant="solid"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={LoginHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="outline"
        colorScheme="red"
        width="100%"
        onClick={() => {
          EmailRef.current.value = "admin@example.com";
          PasswordRef.current.value = "123456";
        }}
      >
        Admin Credentials Login
      </Button>
    </VStack>
  );
};

export default Login;
