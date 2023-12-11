import express from "express";
import { body } from "express-validator";
import favoriteController from "../controllers/favorite.controller.js";
import userController from "../controllers/user.controller.js";
import requestHandler from "../handlers/request.handler.js";
import userModel from "../models/user.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import listController from "../controllers/list.controller.js";

const router = express.Router();

// user
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
  "/update_profile",
  tokenMiddleware.auth,
  body("displayName")
    .exists()
    .withMessage("Display name is required")
    .isLength({ min: 3 })
    .withMessage("Display name minimum 3 characters"),
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
  requestHandler.validate,
  userController.updateProfile
);

router.get("/info", tokenMiddleware.auth, userController.getInfo);
router.post("/logout", tokenMiddleware.auth, userController.logout);

// favorite
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
    .withMessage("Type is required")
    .custom((type) => ["movie", "tv"].includes(type))
    .withMessage("Type invalid"),
  body("mediaId")
    .exists()
    .withMessage("MediaId is required")
    .isLength({ min: 1 })
    .withMessage("MediaId can not be empty"),
  body("mediaTitle").exists().withMessage("MediaTitle is required"),
  body("mediaPoster").exists().withMessage("MediaPoster is required"),
  requestHandler.validate,
  favoriteController.addFavorite
);

router.delete(
  "/favorites/:favoriteId",
  tokenMiddleware.auth,
  favoriteController.removeFavorite
);

//list
router.get("/lists", tokenMiddleware.auth, listController.getListsOfUser);

router.post(
  "/lists",
  tokenMiddleware.auth,
  body("title").exists().withMessage("Title is required"),
  body("description").exists().withMessage("Description is required"),
  requestHandler.validate,
  listController.addList
);

router.delete(
  "/lists/:listId",
  tokenMiddleware.auth,
  listController.removeList
);

// movie in list
router.get(
  "/list_movie/:listId",
  tokenMiddleware.auth,
  listController.getMovieOfList
);

router.post(
  "/list_movie/:listId",
  tokenMiddleware.auth,
  body("type")
    .exists()
    .withMessage("Type is required")
    .custom((type) => ["movie", "tv"].includes(type))
    .withMessage("Type invalid"),
  body("mediaId")
    .exists()
    .withMessage("MediaId is required")
    .isLength({ min: 1 })
    .withMessage("MediaId can not be empty"),
  body("mediaTitle").exists().withMessage("MediaTitle is required"),
  body("mediaPoster").exists().withMessage("MediaPoster is required"),
  requestHandler.validate,
  listController.addMovieIntoList
);

router.delete(
  "/list_movie/:movieId/:listId",
  tokenMiddleware.auth,
  listController.removeMovieInList
);

export default router;
