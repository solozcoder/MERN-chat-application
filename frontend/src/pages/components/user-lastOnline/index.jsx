import { Text } from "@chakra-ui/react";
import { format } from "timeago.js";

const UserLastOnline = ({ getTime, style, action }) => {
  var dateObj = new Date(getTime);
  var hour = dateObj.getHours();
  var minutes = dateObj.getMinutes();

  var times = "";

  // if (action.isOnline === "online") {
  //   times = format(getTime, "ID");
  // }

  return (
    <Text style={{ ...style }} fontSize={"13px"} color={"#7a7a7a"}>
      {hour}:{minutes}
    </Text>
  );
};

export default UserLastOnline;
