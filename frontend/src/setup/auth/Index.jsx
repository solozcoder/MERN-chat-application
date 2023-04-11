import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import SignIn from "../../pages/sign-in";
import SignUp from "../../pages/sign-up";

const MainAuth = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color="black">
          Chat Room
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant="enclosed">
          <TabList mb="1em">
            <Tab>SignIn</Tab>
            <Tab>SignUp</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SignIn />
            </TabPanel>

            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default MainAuth;
