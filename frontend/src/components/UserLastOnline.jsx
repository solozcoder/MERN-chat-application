import { Text } from "@chakra-ui/react";

const UserLastOnline = ({ getTime, style }) => {
  var dateObj = new Date(getTime);
  var hour = dateObj.getHours();
  var minutes = dateObj.getMinutes();

  return (
    <Text style={{ ...style }} fontSize={"13px"} color={"#7a7a7a"}>
      {hour}.{minutes}
    </Text>
  );
};

export default UserLastOnline;
