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

import { useContext, useEffect, useState, useRef } from "react";

import { MoonIcon, SunIcon, SearchIcon } from "@chakra-ui/icons";
import { BiLogOut } from "react-icons/bi";
import { BsPlusLg } from "react-icons/bs";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import { useAuthContext } from "../../hooks/user-hooks";
import { useSearchUserMutation } from "../../../../api/usersApi";

const Header = ({ socket }) => {
  const { user, setUser } = useAuthContext();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [query, setQuery] = useState("");
  const [apiQuery, setApiQuery] = useState([]);
  const refSearch = useRef("");
  const [inpFocus, setInpFocus] = useState(false);

  var [searchUser, { data: getUserSearch = [] }] = useSearchUserMutation();

  useEffect(() => {
    const timeOut = setTimeout(() => {
      searchUser({
        userToken: user.token,
        userString: refSearch.current.value,
      });
    }, 500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [query]);

  return (
    <Stack bg={useColorModeValue("gray.100", "gray.900")} px={4} width={"100%"}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"center"}
        gap={4}
        width={"100%"}
      >
        <Box className="user-profile">
          <Menu>
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}
            >
              <Avatar width={"40px"} height={"40px"} src="" />
            </MenuButton>
            <MenuList alignItems={"center"}>
              <Center margin={"13px 0 15px 0"}>
                <Avatar size={"2xl"} src="" />
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

        <Box width={{ base: "80%", md: "50%" }}>
          <HStack zIndex={3}>
            <Box position={"relative"} zIndex={3} width={"100%"}>
              <Input
                ref={refSearch}
                onChange={(e) => setQuery(() => e.target.value)}
                placeholder="Search..."
                bg={useColorModeValue("white", "#1a202c")}
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
                cursor={"text"}
                zIndex={5}
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
                  {!getUserSearch || getUserSearch.length === 0 ? (
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
                    getUserSearch.map((obj, index) => (
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
                          getUserSearch.length - 1 === index
                            ? "0 0 8px 8px"
                            : "0"
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
                        <FaUsers fontSize={"20px"} /> <span>Add Group's</span>
                      </HStack>
                    </Box>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Box> */}
          </HStack>
        </Box>
      </Flex>
    </Stack>
  );
};

export default Header;
