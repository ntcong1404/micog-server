import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";
import crypto from "crypto";

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

    const token = jsonwebtoken.sign({ data: user.id }, "1234", {
      expiresIn: "24h",
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

    const token = jsonwebtoken.sign({ data: user._id }, "1234", {
      expiresIn: "48h",
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

export default {
  signup,
  signin,
  getInfo,
  updateProfile,
};
