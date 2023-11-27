import express from "express";
import personController from "../controllers/person.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/list/a/b/:type", personController.getPeople);
router.get("/:id", personController.getPeopleDetails);
router.get("/:id/:option", personController.getPeopleDetailsOptions);

export default router;
