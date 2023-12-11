import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";
import crypto from "crypto";
import fs from "fs";

// Tạo cặp khóa RSA
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});
// Lưu khóa bí mật vào tệp tin
fs.writeFileSync(
  "private.key",
  privateKey.export({ type: "pkcs1", format: "pem" })
);
// Lưu khóa công khai vào tệp tin
fs.writeFileSync(
  "public.key",
  publicKey.export({ type: "pkcs1", format: "pem" })
);

const signup = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    const checkUser = await userModel.findOne({ email });
    if (checkUser) return responseHandler.badrequest(res, "Email already used");
    let user = new userModel();
    user.displayName = displayName;
    user.email = email;
    user.setPassword(password);
    await user.save();
    const privateKey = fs.readFileSync("private.key");

    const token = jsonwebtoken.sign({ data: user.id }, privateKey, {
      expiresIn: "1h",
      algorithm: "RS256",
    });

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch {
    responseHandler.error(res);
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel
      .findOne({ email })
      .select("email password salt createdAt displayName")
      .lean();
    if (!user) return responseHandler.badrequest(res, "User not exist");

    const isMatch = crypto
      .pbkdf2Sync(password, user.salt, 1000, 64, "sha512")
      .toString("hex");
    if (user.password !== isMatch)
      return responseHandler.badrequest(res, "Wrong password");
    const privateKey = fs.readFileSync("private.key");

    const token = jsonwebtoken.sign({ data: user._id }, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
    });

    user.password = undefined;
    user.salt = undefined;

    responseHandler.created(res, {
      token,
      ...user,
      id: user.id,
    });
  } catch {
    responseHandler.error(res);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { displayName, password, newPassword } = req.body;

    const user = await userModel
      .findById(req.user.id)
      .select("password id salt");

    if (!user) return responseHandler.unauthorize(res);

    const isMatch = crypto
      .pbkdf2Sync(password, user.salt, 1000, 64, "sha512")
      .toString("hex");
    if (user.password !== isMatch)
      return responseHandler.badrequest(res, "Wrong password");

    user.setPassword(newPassword);
    user.displayName = displayName;

    await user.save();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch {
    responseHandler.error(res);
  }
};

const logout = async (req, res) => {
  try {
    console.log("logout");
    responseHandler.ok(res, "logout");
  } catch {
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  getInfo,
  updateProfile,
  logout,
};
