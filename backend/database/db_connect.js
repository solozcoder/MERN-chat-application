require("dotenv").config();
const mongoose = require("mongoose");

const mongoOpt = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const getConnection = (state) => {
  mongoose
    .connect(process.env.DATABASE_URL, mongoOpt)
    .then((res) => state())
    .catch((err) => console.log(err));
};

module.exports = { getConnection };
