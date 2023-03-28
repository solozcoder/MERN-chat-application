import { ArrowLeftIcon } from "@chakra-ui/icons";
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
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuthContext } from "../hooks/authHook";

import { AiOutlineSend } from "react-icons/ai";
import { BsThreeDotsVertical, BsCheck2All, BsCheck2 } from "react-icons/bs";
import { BiBlock, BiTrash, BiInfoCircle } from "react-icons/bi";

import ScrollableFeed from "react-scrollable-feed";
import UserLastOnline from "./UserLastOnline";

const Conversation = ({ socket, chatId }) => {
  const { user, setUser } = useAuthContext();
  const { userId } = useParams();
  const [getUserChat, setUserChat] = useState({});
  const [getAllChat, setAllChat] = useState([]);

  const scrollRef = useRef();
  const messageInpRef = useRef();

  const [isMobileScreen2] = useMediaQuery("(min-width: 768px)");

  const navigate = useNavigate();
  var getUrl = !userId ? chatId : userId;

  if (!getUrl) {
    return (
      <Box display={"flex"} height={"94vh"}>
        <p>Empty chat</p>
      </Box>
    );
  }

  // Fetch all chat
  useEffect(() => {
    const controller = new AbortController();

    axios({
      url: `http://localhost:5000/api/chat/${getUrl}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      withCredentials: true,
      signal: controller.signal,
    })
      .then((response) => {
        var { getUserChat, getMessageUser } = response.data;

        setUserChat(() => {
          return getUserChat;
        });
        if (getMessageUser) {
          setAllChat([...getMessageUser]);
        }
      })
      .catch((err) => {
        if (err.code === "ERR_CANCELED") return;
        console.log(err.response.data);
      });

    return () => {
      controller.abort();
    };
  }, [getUrl]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setAllChat(data.chat);
    });
  }, [socket, getAllChat]);

  const sendMessage = () => {
    var sockObj = {
      _id: getUrl,
      sender: {
        _id: user._id,
        username: user.username,
        picture: user.picture,
        status: user.status,
      },
      message: messageInpRef.current.value,
      timestamp: new Date().getTime(),
    };

    socket.emit("sendMessage", {
      ...sockObj,
    });

    var allChat = getAllChat;
    allChat.push({
      ...sockObj,
    });

    setAllChat([...allChat]);
    messageInpRef.current.value = "";
  };

  return (
    <Box display={"block"} position={"relative"} mr={5} height={"100%"}>
      <HStack
        padding={"12px"}
        position={"relative"}
        alignItems={"center"}
        margin={"0 auto"}
        borderBottom={"1px solid #aaa"}
      >
        {getUserChat.status && (
          <>
            <HStack
              cursor={"pointer"}
              _hover={{
                bgColor: "#dddddd97",
                outline: "none",
              }}
              p={2}
              borderRadius={"8px"}
              onClick={() => navigate("/")}
            >
              {!isMobileScreen2 && <ArrowLeftIcon fontSize={"10px"} />}
              <Avatar size={"sm"} mr={2} src={getUserChat.username} />
            </HStack>

            <Stack
              _hover={{
                bgColor: "#dddddd97",
                outline: "none",
              }}
              width={"100%"}
              p={2}
              borderRadius={"8px"}
              cursor={"pointer"}
              lineHeight={"13px"}
            >
              <p>{getUserChat.username}</p>
              <UserLastOnline
                getTime={getUserChat.status.lastOnline}
                style={{ textAlign: "left" }}
              />
            </Stack>
            <Box position={"absolute"} right={"10px"}>
              <Popover isLazy>
                <PopoverTrigger>
                  <Button bgColor={"transparent"} p={0} m={0}>
                    <BsThreeDotsVertical fontSize={"18px"} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent width={"200px"}>
                  <PopoverArrow />
                  <PopoverBody>
                    <Box>
                      {/* <HStack
                        color={"#4795f3"}
                        _hover={{
                          bgColor: "#dddddd97",
                          outline: "none",
                        }}
                        p={2}
                        borderRadius={"8px"}
                        cursor={"pointer"}
                      >
                        <BiInfoCircle fontSize={"md"} />
                        <span>Info</span>
                      </HStack> */}
                      {/* <HStack
                        color={"red"}
                        _hover={{
                          bgColor: "#dddddd97",
                          outline: "none",
                        }}
                        p={2}
                        borderRadius={"8px"}
                        cursor={"pointer"}
                      >
                        <BiBlock fontSize={"md"} />
                        <span>Block User's</span>
                      </HStack> */}
                      <HStack
                        color={"red"}
                        _hover={{
                          bgColor: "#dddddd97",
                          outline: "none",
                        }}
                        p={2}
                        borderRadius={"8px"}
                        cursor={"pointer"}
                        onClick={() =>
                          deleteUserMessage(userId._id, getUserChat._id)
                        }
                      >
                        <BiTrash fontSize={"md"} />
                        <span>Delete Message's</span>
                      </HStack>
                    </Box>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box>
          </>
        )}
      </HStack>

      <Stack paddingBottom={"50px"} mt={3} maxHeight={"83vh"}>
        <ScrollableFeed ref={scrollRef}>
          {getAllChat.map((userChat, index) => (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: `${
                  userChat.sender._id !== user._id ? "flex-start" : "flex-end"
                }`,
                marginBottom: "5px",
                position: "relative",
              }}
              key={index}
            >
              {userChat.sender._id !== user._id && (
                <Tooltip
                  label={userChat.sender.username}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    position={"relative"}
                    ml={1}
                    size="sm"
                    cursor="pointer"
                    src={userChat.sender.picture}
                  />
                </Tooltip>
              )}

              <Stack
                style={{
                  backgroundColor: `${
                    userChat.sender._id === user._id ? "#B9F5D0" : "#BEE3F8"
                  }`,
                  position: "relative",
                  borderRadius: `${
                    userChat.sender._id === user._id
                      ? "10px 0 20px 10px"
                      : "0px 10px 10px 20px"
                  }`,
                  padding: "5px 15px 10px 15px",
                  margin: "6px",
                }}
              >
                <HStack colSpan={1}>
                  <Box
                    maxWidth={"220px"}
                    onTouchMove={() => {
                      console.log("hovered");
                    }}
                  >
                    <Text fontSize={"md"} color={"black"}>
                      {userChat.message}
                    </Text>
                  </Box>
                  <Box display={"block"} width="45px" colSpan={2}>
                    <UserLastOnline
                      getTime={userChat.timestamp}
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

              {userChat.sender._id === user._id && (
                <Tooltip
                  label={userChat.sender.username}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    position={"relative"}
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    src={userChat.sender.picture}
                  />
                </Tooltip>
              )}
            </div>
          ))}
        </ScrollableFeed>
      </Stack>
      <HStack position={"absolute"} bottom={"0"} width={"100%"}>
        <Input ref={messageInpRef} placeholder={"Send message..."} />
        <AiOutlineSend
          size={"1.8rem"}
          cursor={"pointer"}
          onClick={sendMessage}
        />
      </HStack>
    </Box>
  );
};

{
}

export default Conversation;
