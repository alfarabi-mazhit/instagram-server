const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  createStory,
  getMyStories,
  getStoriesByUserId24h,
  deleteStoryById,
  storyLike,
} = require("./controllers");
const { validateStory, isAuthorOfStory } = require("./middlewares");
const { upload } = require("./utils");
router.post(
  "/api/story",
  passport.authenticate("jwt", { session: false }),
  upload.single("media"),
  validateStory,
  createStory
);
router.get(
  "/api/myStories",
  passport.authenticate("jwt", { session: false }),
  getMyStories
);
router.get(
  "/api/storiesByUser/:id",
  // passport.authenticate("jwt", { session: false }),
  getStoriesByUserId24h
);
router.delete(
  "/api/story/:id",
  passport.authenticate("jwt", { session: false }),
  isAuthorOfStory,
  deleteStoryById
);
router.post(
  "/api/story/:id/like",
  passport.authenticate("jwt", { session: false }),
  storyLike
);

module.exports = router;
