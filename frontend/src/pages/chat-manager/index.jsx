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
  Skeleton,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRef, useState, useEffect, useContext } from "react";

import ScrollableFeed from "react-scrollable-feed";
import { useGetFriendMessageQuery } from "../../redux/api-slice/message-slice";

import DisplayFriends from "../components/display-chat-manager/display-friends";
import InputMessage from "../components/display-chat-manager/display-input";
import DisplayMessage from "../components/display-chat-manager/display-message";
import DisplayMessageHeader from "../components/display-chat-manager/display-message/header";
import { useAuthContext } from "../hooks/user-hooks";

const ChatManager = ({ socket }) => {
  const { user, setUser } = useAuthContext();
  const [isMobileScreen2] = useMediaQuery("(min-width: 768px)");
  const [getUserChat, setUserChat] = useState({});
  const [getFriend, setFriend] = useState([]);
  const [getLastChat, setLastMessage] = useState("");

  const { data: fetchUserChat = [], isLoading: userChatLoading } =
    useGetFriendMessageQuery({
      userToken: user.token,
    });

  useEffect(() => {
    setFriend([...fetchUserChat]);
  }, [fetchUserChat.length > 0]);

  return (
    <HStack mt={1} width={"100%"}>
      <Box
        display={{ base: "block", md: "flex" }}
        flexDirection={"column"}
        width={{ base: "100%", md: "40%", lg: "30%" }}
        height={"88vh"}
        className="user-navbar"
        margin={2}
      >
        <Box width={"100%"}>
          <ScrollableFeed>
            {userChatLoading && fetchUserChat.length === 0 && <Skeleton />}
            {fetchUserChat.length === 0 && !userChatLoading && (
              <Text as={"i"} fontSize={"md"} textAlign={"center"}>
                Chat currently empty.
              </Text>
            )}
            {getFriend.length > 0 &&
              getFriend.map((chats, index) => (
                <DisplayFriends
                  key={index + 1}
                  state={{ getUserChat, setUserChat }}
                  property={chats}
                />
              ))}
          </ScrollableFeed>
        </Box>
      </Box>

      {isMobileScreen2 && (
        <Box display={"block"} width={"100%"} height={"88vh"}>
          {Object.keys(getUserChat).length === 0 && (
            <VStack
              alignContent={"center"}
              justifyContent={"center"}
              position={"relative"}
              m={15}
              height={"100%"}
              margin={"0 auto"}
            >
              <Text fontSize={"2xl"}>
                No Chat Displayed, Search User or Click someone.
              </Text>
            </VStack>
          )}
          {Object.keys(getUserChat).length > 0 && (
            <Box display={"block"} position={"relative"} height={"100%"}>
              <DisplayMessageHeader propertyChat={getUserChat} />
              <DisplayMessage propertyChat={getUserChat} socket={socket} />
            </Box>
          )}
        </Box>
      )}
    </HStack>
  );
};

export default ChatManager;
