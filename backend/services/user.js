const userModel = require("../models/User");
const ethSig = require("eth-sig-util");
const ethUtil = require("ethereumjs-util");
const jwt = require("jsonwebtoken");

const findeByAddress = async (publicAddress) => {
  const user = await userModel.findOne({ publicAddress });
  if (!user) {
    return false;
  }
  return user;
};

const create = async (data) => {
  const user = await userModel.create(data);
  return user;
};

const authenticateUser = async (userData) => {
  const { signature, publicAddress } = userData;
  const user = await userModel.findOne({ where: { publicAddress } });

  if (!user) {
    return `User with publicAddress ${publicAddress} is not found in database`;
  }

  if (!(user instanceof userModel)) {
    throw new Error('User is not defined in "Verify digital signature".');
  }

  const msg = `signing one-time nonce: ${user.nonce}`;

  /* We now are in possession of msg, publicAddress and signature. We
  will use a helper from eth-sig-util to extract the address from the signature */

  const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, "utf8"));
  const address = ethSig.recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });

  if (address.toLowerCase() !== publicAddress.toLowerCase()) {
    return "Signature verification failed";
  }

  user.nonce = Math.floor(Math.random() * 10000);
  user.save();

  const token = await jwt.sign(
    { payload: { publicAddress } },
    process.env.SECRET,
    { algorithm: "HS256" }
  );
  return token;
};

module.exports = {
  findeByAddress,
  authenticateUser,
  create,
};
