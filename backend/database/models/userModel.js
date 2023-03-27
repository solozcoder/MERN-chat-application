const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isVerify: { type: Boolean, default: false },
    password: { type: String, required: true },
    picture: {
      type: String,
      trim: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      require: true,
    },
    status: { type: Object, ref: "status" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const saltBcrypt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, saltBcrypt);
});

userSchema.methods.matchPassword = function (userPass) {
  return bcrypt.compareSync(userPass, this.password);
};

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
