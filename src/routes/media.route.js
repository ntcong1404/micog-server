import express from "express";
import mediaController from "../controllers/media.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/search", mediaController.search);
router.get("/genres", mediaController.getGenres);
router.get("/discover", mediaController.getDiscover);
router.get("/main", mediaController.getMain);
router.get("/trending/:time", mediaController.getTrending);
router.get("/collection/:id", mediaController.getCollections);
router.get("/season/:id/:number", mediaController.getSeason);
router.get("/:id", mediaController.getDetails);
router.get("/:id/:option", mediaController.getDetailsOptions);

export default router;
