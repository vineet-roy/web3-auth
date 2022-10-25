const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  nonce: {
    type: Number,
    required: false,
    default: Math.floor(Math.random() * 1000000),
  },
  publicAddress: {
    type: String,
    required: false,
    unique: true,
  },
  refreshToken: {
    type: String,
    required: false,
    unique: true,
  },
});

UserSchema.methods.generateRefreshToken = function () {
  const User = this;
  const refreshToken = jwt.sign({ publicAddress: User.publicAddress },  
    process.env.REFRESH_TOKEN_SECRET
  );
  User.refreshToken = refreshToken;
}

const User = mongoose.model("User", UserSchema);

module.exports = User;
