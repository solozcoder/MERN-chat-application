import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import io from "socket.io-client";
import ChatManager from "../chat-manager";
import Header from "../components/header";
import { useAuthContext } from "../hooks/user-hooks";

const MainIndex = ({ socket }) => {
  const { user, setUser } = useAuthContext();

  useEffect(() => {
    socket.on("user_connect", (data) => {
      console.log(data);
    });
  }, [socket]);

  return (
    <Box overflowX={"hidden"}>
      <Header socket={socket} />
      <ChatManager socket={socket} />
    </Box>
  );
};

export default MainIndex;
