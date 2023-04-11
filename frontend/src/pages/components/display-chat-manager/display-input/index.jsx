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
import { useRef } from "react";

import { AiOutlineSend } from "react-icons/ai";
import { useAuthContext } from "../../../hooks/user-hooks";

const InputMessage = ({ socket, chatId }) => {
  const { user, setUser } = useAuthContext();
  const messageInpRef = useRef("");

  const sendMessage = () => {
    socket.emit("sendMessage", {
      chatId,
      sender: user,
      message: messageInpRef.current.value,
    });
  };

  return (
    <HStack position={"absolute"} bottom={"0"} width={"100%"} pr={8}>
      <Input ref={messageInpRef} placeholder={"Send message..."} />
      <AiOutlineSend size={"1.8rem"} cursor={"pointer"} onClick={sendMessage} />
    </HStack>
  );
};

export default InputMessage;
