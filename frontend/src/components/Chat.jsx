import axios from "axios";
import { useMemo, useContext, useEffect, useRef, useState } from "react";

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
  baseTheme,
  extendBaseTheme,
  useMediaQuery,
} from "@chakra-ui/react";

import { MoonIcon, SunIcon, SearchIcon } from "@chakra-ui/icons";

import { BsPlusLg } from "react-icons/bs";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

import { useAuthContext } from "../hooks/authHook";
// import { userContext } from "../context/userContext";
import "./../assets/css/chatContainer.scss";
import FetchData from "./FetchData";
import { useNavigate, useParams } from "react-router-dom";
import UserLastOnline from "./UserLastOnline";
import Conversation from "./Conversation";

const Chat = ({ socket }) => {
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [getInfoChat, setInfoChat] = useState([]);

  // search input
  const [query, setQuery] = useState("");
  const [apiQuery, setApiQuery] = useState([]);
  const refSearch = useRef("");

  const [inpFocus, setInpFocus] = useState(false);

  const [getUserId, setUserId] = useState("");

  // const { userId } = useParams();
  // console.log(useParams());

  // Fetch all user
  useEffect(() => {
    const controller = new AbortController();

    axios({
      url: `http://localhost:5000/api/chat`,
      method: "get",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      withCredentials: true,
      signal: controller.signal,
    })
      .then((response) => {
        setInfoChat(() => {
          return response.data;
        });
        // console.log(response.data);
      })
      .catch((err) => {
        if (err.code === "ERR_CANCELED") return;
        console.log(err);
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeOut = setTimeout(() => {
      if (!refSearch.current.value) return setApiQuery("");
      axios({
        url: `http://localhost:5000/api/users?search=${refSearch.current.value}`,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        method: "get",
        withCredentials: true,
        signal: controller.signal,
      })
        .then((response) => {
          setApiQuery(() => {
            return response.data;
          });
        })
        .catch((err) => {
          if (err.code === "ERR_CANCELED") return;
        });
    }, 500);

    return () => {
      clearTimeout(timeOut);
      controller.abort();
    };
  }, [query]);

  // const handleMessage = (objUser) => {
  //   console.log(objUser);
  // };

  // useEffect(() => {
  //   socket.on("userConnected", (data) => {
  //     console.log(data);
  //   });
  // }, [socket]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      var allChat = getInfoChat;
      allChat = allChat.filter((arr) => arr._id !== data._id);
      allChat.push({ ...data });

      setInfoChat([...allChat]);
    });
  }, [socket, getInfoChat]);

  const messageClick = (objUser) => {
    if (objUser._id !== user._id) {
      navigate(`/chat/${objUser._id}`);
    }
  };

  const [isMobileScreen1] = useMediaQuery("(max-width: 768px)");
  const [isMobileScreen2] = useMediaQuery("(min-width: 768px)");
  const [isTabletScreen] = useMediaQuery("(min-width: 992px)");
  const [isDesktopScreen] = useMediaQuery("(min-width: 1200px)");
  return (
    <HStack mt={1} width={"100%"}>
      <Box
        display={{ base: "block", md: "flex" }}
        flexDirection={"column"}
        width={{ base: "100%", md: "35%", lg: "30%" }}
        height={"94vh"}
        justifyContent={"start"}
        alignItems={"center"}
        className="user-navbar"
        margin={4}
      >
        <Stack direction={"row"} spacing={"7"} width={"100%"} mb={3}>
          <Box className="user-profile">
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar width={"40px"} height={"40px"} src={user.picture} />
              </MenuButton>
              <MenuList alignItems={"center"}>
                <Center margin={"13px 0 15px 0"}>
                  <Avatar size={"2xl"} src={user.picture} />
                </Center>
                <Center>
                  <p>{user.username}</p>
                </Center>
                <Center margin={"0 0 15px 0"}>
                  <p color={"red"}>{user.email}</p>
                </Center>
                <MenuDivider />
                <MenuItem onClick={toggleColorMode}>
                  Theme&nbsp;&nbsp;
                  {colorMode !== "light" ? <MoonIcon /> : <SunIcon />}
                </MenuItem>
                <MenuItem>
                  <Box>
                    <HStack
                      color={"red"}
                      onClick={() => setUser({ type: "LOGOUT" })}
                    >
                      <BiLogOut />
                      <span>&nbsp;&nbsp;Logout</span>
                    </HStack>
                  </Box>
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>

          <Box width={"100%"}>
            <HStack zIndex={3}>
              <Box position={"relative"} width={"100%"} zIndex={3}>
                <Input
                  ref={refSearch}
                  onChange={(e) => setQuery(() => e.target.value)}
                  placeholder="Search..."
                  bg={"white"}
                  rounded={"full"}
                  zIndex={3}
                  border={"1px solid #717171"}
                  paddingRight={"35px"}
                  onBlur={() => {
                    setTimeout(() => {
                      setInpFocus(false);
                    }, 500);
                  }}
                  onFocus={() => setInpFocus(true)}
                />
                <SearchIcon
                  position={"absolute"}
                  right={"13px"}
                  top={"12px"}
                  zIndex={3}
                />
                <Stack
                  position={"relative"}
                  width={"100%"}
                  display={inpFocus ? "inherit" : "none"}
                  zIndex={0}
                >
                  <Box
                    style={{
                      position: "absolute",
                      backgroundColor: "white",
                      border: "1px solid #717171",
                      borderRadius: "0 0 8px 8px",
                      width: "100%",
                      paddingTop: "25px",
                      zIndex: 0,
                      top: "-20px",
                      textAlign: "center",
                      margin: "0 auto",
                    }}
                    boxShadow={"lg"}
                  >
                    {!apiQuery || apiQuery.length === 0 ? (
                      <Text
                        as="i"
                        fontSize="lg"
                        color={"black"}
                        position={"relative"}
                        padding={"8px"}
                        top={"-5px"}
                        right={"0"}
                        left={"0"}
                        bottom={"0"}
                        zIndex={21}
                      >
                        No user was found
                      </Text>
                    ) : (
                      apiQuery.map((obj, index) => (
                        <HStack
                          key={index}
                          onClick={() => {
                            if (!isMobileScreen2) messageClick(obj);
                            else {
                              setUserId(obj._id);
                            }
                          }}
                          style={{
                            listStyle: "none",
                            padding: "8px",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                          borderRadius={
                            apiQuery.length - 1 === index ? "0 0 8px 8px" : "0"
                          }
                          _hover={{ backgroundColor: "#d6dadf" }}
                        >
                          <Avatar
                            size={"sm"}
                            src={obj.picture}
                            m={"3px 2px 3px 2px"}
                          />
                          <Stack
                            whiteSpace={"nowrap"}
                            overflow={"hidden"}
                            textOverflow={"ellipsis"}
                          >
                            <Text fontSize={"md"} mt={3} p={0} lineHeight={0}>
                              {obj._id === user._id
                                ? `${obj.username} (You)`
                                : obj.username}
                            </Text>
                            <Text fontSize={"sm"} position={"relative"}>
                              Email: {obj.email}
                            </Text>
                          </Stack>
                        </HStack>
                      ))
                    )}
                  </Box>
                </Stack>
              </Box>
              {/* <Box>
                    <Popover isLazy>
                      <PopoverTrigger>
                        <Button bgColor={"transparent"} p={0} m={0}>
                          <BsPlusLg fontSize={"23px"} cursor={"pointer"} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent width={"200px"}>
                        <PopoverArrow />
                        <PopoverBody>
                          <Box>
                            <HStack
                              color={"#4795f3"}
                              _hover={{
                                bgColor: "#dddddd97",
                                outline: "none",
                              }}
                              p={2}
                              borderRadius={"8px"}
                              cursor={"pointer"}
                            >
                              <FaUsers fontSize={"20px"} />{" "}
                              <span>Add Group's</span>
                            </HStack>
                          </Box>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Box> */}
            </HStack>
          </Box>
        </Stack>

        {getInfoChat.map((userChat, index) => {
          var getUser = userChat.for[0];

          for (var i = 0; i < userChat.for.length; i++) {
            if (userChat.for[i]._id !== user._id) {
              getUser = userChat.for[i];
            }
          }

          if (!getUser.status) return "";

          return (
            <HStack
              key={index + 1}
              width={"100%"}
              height={"60px"}
              padding={"12px"}
              position={"relative"}
              borderBottom={"1px solid #aaa"}
              borderRadius={"3px"}
              cursor={"pointer"}
              _hover={{
                bgColor: "#dddddd97",
                outline: "none",
              }}
              onClick={() => {
                if (!isMobileScreen2) {
                  messageClick(getUser);
                } else {
                  setUserId(getUser._id);
                }
              }}
            >
              <Avatar size={"sm"} mr={2} src={getUser.username} />
              <Stack lineHeight={"13px"}>
                <p>{getUser.username}</p>
                <p>{userChat.lastestChat}</p>
              </Stack>
              <UserLastOnline
                getTime={getUser.status.lastOnline}
                style={{ position: "absolute", right: "20px", top: "11px" }}
              />
            </HStack>
          );
        })}
      </Box>
      {isMobileScreen2 && (
        <Box display={"block"} width={"100%"} height={"94vh"}>
          {getUserId.length > 0 && (
            <Conversation socket={socket} chatId={getUserId} />
          )}
        </Box>
      )}
    </HStack>
  );
};

export default Chat;
