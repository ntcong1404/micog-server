import express from "express";
import { body } from "express-validator";
import favoriteController from "../controllers/favorite.controller.js";
import userController from "../controllers/user.controller.js";
import requestHandler from "../handlers/request.handler.js";
import userModel from "../models/user.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post(
  "/signup",
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value) => {
      const user = await userModel.findOne({ email: value });
      if (user) return Promise.reject("Email already used");
    }),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password minimum 6 characters"),
  body("displayName")
    .exists()
    .withMessage("Display name is required")
    .isLength({ min: 3 })
    .withMessage("Display name minimum 3 characters"),
  requestHandler.validate,
  userController.signup
);

router.post(
  "/signin",
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password minimum 6 characters"),
  requestHandler.validate,
  userController.signin
);

router.put(
  "/update_password",
  tokenMiddleware.auth,
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password minimum 6 characters"),
  body("newPassword")
    .exists()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password minimum 6 characters"),
  body("confirmNewPassword")
    .exists()
    .withMessage("Confirm new password is required")
    .isLength({ min: 6 })
    .withMessage("Confirm new password minimum 6 characters")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword)
        throw new Error("Confirm new password not match");
      return true;
    }),
  requestHandler.validate,
  userController.updatePassword
);

router.get("/info", tokenMiddleware.auth, userController.getInfo);

router.get(
  "/favorites",
  tokenMiddleware.auth,
  favoriteController.getFavoritesOfUser
);

router.post(
  "/favorites",
  tokenMiddleware.auth,
  body("type")
    .exists()
    .withMessage("type is required")
    .custom((type) => ["movie", "tv"].includes(type))
    .withMessage("type invalid"),
  body("mediaId")
    .exists()
    .withMessage("mediaId is required")
    .isLength({ min: 1 })
    .withMessage("mediaId can not be empty"),
  body("mediaTitle").exists().withMessage("mediaTitle is required"),
  body("mediaPoster").exists().withMessage("mediaPoster is required"),
  body("mediaRate").exists().withMessage("mediaRate is required"),
  requestHandler.validate,
  favoriteController.addFavorite
);

router.delete(
  "/favorites/:favoriteId",
  tokenMiddleware.auth,
  favoriteController.removeFavorite
);

export default router;
