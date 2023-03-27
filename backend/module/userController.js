require("dotenv").config();
const Users = require("../database/models/userModel");
const jwt = require("jsonwebtoken");
const AsyncHandler = require("express-async-handler");

const GenerateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const UserQuery = AsyncHandler(async (req, res) => {
  var { search, q } = req.query;

  if (search) {
    var getUser = await Users.find({
      // $or: [
      // {
      username: { $regex: new RegExp("^" + search.toLowerCase(), "i") },
      // },
      // { email: { $regex: new RegExp("^" + search.toLowerCase(), "i") } },
      // ],
    }).select("-password -createdAt -updatedAt -__v");
    res.status(200).json(getUser);
  } else if (q === "all") {
    var getUser = await Users.find({}).select(
      "-password -createdAt -updatedAt -__v"
    );
    res.status(200).json(getUser);
  }
});

// const AddUser = AsyncHandler(async (req, res) => {
//   const { userId } = req.query;

// })

const AuthUser = AsyncHandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    var token = req.headers.authorization.split(" ")[1];
    var isVerify = jwt.verify(token, process.env.JWT_SECRET);

    const getUser = await Users.findOne({ _id: isVerify._id }).select(
      "-password -createdAt -updatedAt -__v"
    );
    if (!getUser) {
      res.status(400);
      throw Error("User not authenticated!");
    }
    req.user = getUser;
    next();
  } else {
    res.status(400);
    throw Error("User not authenticated!");
    // next();
  }
});

const RegisterAuth = AsyncHandler(async (req, res) => {
  var { username, email, password, confirmPass, picture } = req.body;
  const UserReg = new RegExp(/^[a-zA-Z0-9\s]*$/);
  const MailReg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

  if (!username || !email || !password || !confirmPass) {
    res.status(400);
    throw new Error("Please fill all field's!");
  } else if (!UserReg.test(username)) {
    res.status(400);
    throw new Error("Username cannot contain special character!");
  } else if (!MailReg.test(email)) {
    res.status(400);
    throw new Error("Please enter valid Email!");
  } else if (password !== confirmPass) {
    res.status(400);
    throw new Error("Password and Confirm Password must match!");
  } else if (password.length < 6) {
    res.status(400);
    throw new Error("Password must greater than 6 character!");
  }

  const findEmail = await Users.findOne({ email: email });
  if (findEmail) {
    res.status(400);
    throw new Error(
      "Oops this email is already in use for another Person try another one!"
    );
  }
  username = username.replace(/\s\s+/g, " ").trim();

  const CreateUser = await Users.create({
    username,
    email,
    password,
    picture,
    lastOnline: new Date().getTime(),
  });
  return res.status(201).json({ message: "Successfully Create User!" });
});

const LoginAuth = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all field's!");
  }

  const getUser = await Users.findOne({ email });

  if (!getUser || !getUser.matchPassword(password)) {
    res.status(400);
    throw new Error("Wrong Email or Password!");
  }

  return res.json({
    userAuth: {
      _id: getUser._id,
      username: getUser.username,
      email: getUser.email,
      picture: getUser.picture,
      token: GenerateToken(getUser._id),
      status: getUser.status,
    },
    success: "Successfully authorized!",
  });
});

module.exports = { LoginAuth, RegisterAuth, UserQuery, AuthUser };
