import {
  Box,
  Flex,
  Avatar,
  AvatarBadge,
  Input,
  Container,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  HStack,
  VStack,
  Grid,
  GridItem,
  Tooltip,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  useMediaQuery,
} from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";

import ScrollableFeed from "react-scrollable-feed";
import {
  useGetChatByRoomIdQuery,
  usePostMessageMutation,
} from "../../../../redux/api-slice/message-slice";
import { useAuthContext } from "../../../hooks/user-hooks";
import UserLastOnline from "../../user-lastOnline";

import { AiOutlineSend } from "react-icons/ai";
import { BsThreeDotsVertical, BsCheck2All, BsCheck2 } from "react-icons/bs";
import { BiBlock, BiTrash, BiInfoCircle } from "react-icons/bi";

const DisplayMessage = ({ socket, propertyChat, component }) => {
  const { user, setUser } = useAuthContext();
  const messageInpRef = useRef("");

  const [getMessage, setMessage] = useState([]);
  const [postMessages, { data: getPostMessage = [] }] =
    usePostMessageMutation();

  const { data: fetchMessage = [], isLoading } = useGetChatByRoomIdQuery(
    {
      userToken: user.token,
      chatId: propertyChat._id,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    setMessage([...fetchMessage]);
  }, [fetchMessage]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      var allChat = getMessage;
      allChat.push({
        ...data,
      });
      setMessage([...allChat]);
    });
  }, [socket, getMessage]);

  const sendMessage = () => {
    var data = {
      userToken: user.token,
      chatId: propertyChat._id,
      userId: propertyChat.users._id,
      sender: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isVerify: user.isVerify,
        picture: user.picture,
      },
      message: messageInpRef.current.value,
    };

    postMessages({ ...data });
    socket.emit("sendMessage", { ...data });

    var allChat = getMessage;
    allChat.push({
      ...data,
    });
    setMessage([...allChat]);

    messageInpRef.current.value = "";
  };

  return (
    <>
      <Stack paddingBottom={"65px"} maxHeight={"80vh"}>
        <ScrollableFeed>
          {getMessage.length > 0 &&
            getMessage.map((chats, index) => (
              <Box key={index + 1}>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: `${
                      chats.sender._id !== user._id ? "flex-start" : "flex-end"
                    }`,
                    marginBottom: "5px",
                    position: "relative",
                  }}
                  key={index}
                >
                  {chats.sender._id !== user._id && (
                    <Tooltip
                      label={chats.sender.username}
                      placement="bottom-start"
                      hasArrow
                    >
                      <Avatar
                        position={"relative"}
                        ml={1}
                        size="sm"
                        cursor="pointer"
                        src={chats.sender.picture}
                      />
                    </Tooltip>
                  )}

                  <Stack
                    style={{
                      backgroundColor: `${
                        chats.sender._id === user._id ? "#B9F5D0" : "#BEE3F8"
                      }`,
                      position: "relative",
                      borderRadius: `${
                        chats.sender._id === user._id
                          ? "10px 0 20px 10px"
                          : "0px 10px 10px 20px"
                      }`,
                      padding: "5px 15px 10px 15px",
                      margin: "6px",
                    }}
                  >
                    <HStack colSpan={1}>
                      <Box maxWidth={"220px"}>
                        <Text fontSize={"md"} color={"black"}>
                          {chats.message}
                        </Text>
                      </Box>
                      <Box display={"block"} width="45px" colSpan={2}>
                        <UserLastOnline
                          getTime={new Date().getTime()}
                          style={{
                            position: "absolute",
                            padding: "0 15px 0 0",
                            right: "15px",
                            bottom: "3px",
                          }}
                        />
                      </Box>
                      <Box
                        colSpan={1}
                        position={"absolute"}
                        right={"10px"}
                        bottom={"3px"}
                      >
                        <BsCheck2 color={"black"} />
                      </Box>
                    </HStack>
                  </Stack>

                  {chats.sender._id === user._id && (
                    <Tooltip
                      label={chats.sender.username}
                      placement="bottom-start"
                      hasArrow
                    >
                      <Avatar
                        position={"relative"}
                        mr={1}
                        size="sm"
                        cursor="pointer"
                        src={chats.sender.picture}
                      />
                    </Tooltip>
                  )}
                </Box>
              </Box>
            ))}
        </ScrollableFeed>
      </Stack>
      <HStack position={"absolute"} bottom={"0"} width={"100%"} pr={5}>
        <Input ref={messageInpRef} placeholder={"Send message..."} />
        <AiOutlineSend
          size={"1.8rem"}
          cursor={"pointer"}
          onClick={sendMessage}
        />
      </HStack>
    </>
  );
};

export default DisplayMessage;
