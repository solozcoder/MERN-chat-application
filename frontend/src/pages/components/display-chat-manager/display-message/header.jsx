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

import { ArrowLeftIcon } from "@chakra-ui/icons";
import { AiOutlineSend } from "react-icons/ai";
import { BsThreeDotsVertical, BsCheck2All, BsCheck2 } from "react-icons/bs";
import { BiBlock, BiTrash, BiInfoCircle } from "react-icons/bi";
import UserLastOnline from "../../user-lastOnline";
import { useAuthContext } from "../../../hooks/user-hooks";
import { useEffect, useState } from "react";
import {
  useGetChatByRoomIdQuery,
  useGetRoomByIdQuery,
} from "../../../../redux/api-slice/message-slice";

const DisplayMessageHeader = ({ propertyChat }) => {
  const [isMobileScreen2] = useMediaQuery("(min-width: 768px)");
  const { user, setUser } = useAuthContext();

  const bgHoverMode = useColorModeValue("#dddddd97", "#78ffac69");

  // const { data: getUserProperty = [] } = useGetRoomByIdQuery({
  //   userToken: user.token,
  //   roomId: chatId,
  // });

  return (
    <Box display={"block"} position={"relative"} mr={5}>
      <HStack
        cursor={"pointer"}
        _hover={{
          bgColor: bgHoverMode,
          outline: "none",
        }}
        p={2}
        borderRadius={"8px"}
      >
        {!isMobileScreen2 && <ArrowLeftIcon fontSize={"10px"} />}
        <Avatar size={"sm"} mr={2} src={propertyChat.users.picture} />

        <Stack
          width={"100%"}
          p={2}
          borderRadius={"8px"}
          cursor={"pointer"}
          lineHeight={"13px"}
        >
          <p>{propertyChat.users.username}</p>
          <UserLastOnline
            getTime={new Date().getTime()}
            style={{ textAlign: "left" }}
          />
        </Stack>
        {/* <Box position={"absolute"} right={"10px"}>
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
                  <HStack
                    color={"#4795f3"}
                    _hover={{
                      bgColor: bgHoverMode,
                      outline: "none",
                    }}
                    p={2}
                    borderRadius={"8px"}
                    cursor={"pointer"}
                  >
                    <BiInfoCircle fontSize={"md"} />
                    <span>Info</span>
                  </HStack>
                  <HStack
                    color={"red"}
                    _hover={{
                      bgColor: bgHoverMode,
                      outline: "none",
                    }}
                    p={2}
                    borderRadius={"8px"}
                    cursor={"pointer"}
                  >
                    <BiBlock fontSize={"md"} />
                    <span>Block User's</span>
                  </HStack>
                </Box>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box> */}
      </HStack>
    </Box>
  );
};

export default DisplayMessageHeader;
