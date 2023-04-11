const Users = require("../database/models/userModel");

const verifyUser = async (userId) => {
  var findUser = await Users.findOne({
    _id: userId,
  }).select("-password -createdAt -updatedAt -__v");

  if (!findUser) {
    throw Error("Cannot find user's!");
  }

  return findUser;
};
module.exports = { verifyUser };
