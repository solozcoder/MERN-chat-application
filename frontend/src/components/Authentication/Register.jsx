import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useHistory } from "react-router";

const Register = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClick = () =>
    setShow((prev) => {
      return !prev;
    });
  const toast = useToast();
  // const history = useHistory();

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const conPassRef = useRef();

  const [pictureUrl, setPicUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    try {
      setLoading(true);

      var picInp = document.getElementById("reg-picture");

      if (picInp.files.length > 0) {
        picInp = picInp.files[0];

        if (picInp.type.split("/")[0] === "image") {
          const data = new FormData();
          data.append("file", picInp);
          data.append("upload_preset", "image-storage");
          data.append("api_key", "631558453272389");
          data.append("api_secret", "aX6TfNCR-kPkvdU8eXwh_GGgXTw");
          data.append("cloud_name", "solorien");

          const fetchImage = await fetch(
            "https://api.cloudinary.com/v1_1/solorien/image/upload",
            {
              method: "POST",
              body: data,
            }
          );

          setPicUrl(() => {
            return fetchImage.data.url.toString();
          });
        }
      }

      await axios({
        url: "http://localhost:5000/api/register",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          username: usernameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
          confirmPass: conPassRef.current.value,
          picture: pictureUrl,
        },
        withCredentials: true,
      });

      toast({
        title: "Registration Successfully!",
        description: `Successfully register ${usernameRef.current.value}!`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      navigate("/", { replace: true });
    } catch (err) {
      err = err ? err.response.data.message : err.response.data.error.message;

      toast({
        title: "Error Occured!",
        description: err,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Username</FormLabel>
        <Input placeholder="Enter Your Username" ref={usernameRef} />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          ref={emailRef}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            ref={passwordRef}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            ref={conPassRef}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input type="file" p={1.5} accept="image/*" id="reg-picture" />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Register;
