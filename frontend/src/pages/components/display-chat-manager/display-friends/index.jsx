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
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/user-hooks";

const DisplayFriends = ({ state, property }) => {
  const { user, setUser } = useAuthContext();
  const [isMobileScreen2] = useMediaQuery("(min-width: 768px)");
  const bgHoverMode = useColorModeValue("#dddddd97", "#78ffac69");

  var chatProperty = {
    ...property,
  };
  // var objProp = {};

  // if (typeof property.sender !== "undefined") {
  //   userChat.user = property.sender;
  //   userChat.chatId = property.chatId;
  //   userChat.lastestChat = `${property.sender.username}: ${property.message}`;
  // }
  if (Object.keys(property).length > 0) {
    // if (typeof property.users !== "undefined") {
    // console.log(property);
    chatProperty.users = property.users.find((arr) => arr._id !== user._id);
    if (typeof chatProperty.users === "undefined")
      chatProperty.users = property.users[0];
    // }
  }
  // userChat = property;
  // }

  return (
    <HStack
      width={"100%"}
      height={"60px"}
      padding={"12px"}
      position={"relative"}
      borderBottom={"1px solid #aaa"}
      borderRadius={"3px"}
      cursor={"pointer"}
      onClick={() => {
        if (!isMobileScreen2) messageClick(obj);
        else {
          state.setUserChat(chatProperty);
        }
      }}
      _hover={{
        bgColor: bgHoverMode,
        outline: "none",
      }}
    >
      {/* {Object.keys(chatProperty).length > 0 && ( */}
      {/* <> */}
      <Avatar size={"sm"} mr={2} />
      <Stack lineHeight={"13px"}>
        <p>{chatProperty?.users?.username}</p>
        {/* <p>{chatProperty?.lastestChat}</p> */}
      </Stack>
      {/* </> */}
      {/* )} */}
    </HStack>
  );
};

export default DisplayFriends;
