const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  subscribeById,
  subscribeByUsername,
  subscribesToUsername,
  subscribesByUsername,
  suggest,
} = require("./controllers");

router.post(
  "/api/subscribe/:id",
  passport.authenticate("jwt", { session: false }),
  subscribeById
);
router.post(
  "/api/subscribe/byUsername/:username",
  passport.authenticate("jwt", { session: false }),
  subscribeByUsername
);
router.get(
  "/api/subscribe/to/byUsername/:username",
  // passport.authenticate("jwt", { session: false }),
  subscribesToUsername
);
router.get(
  "/api/subscribe/by/byUsername/:username",
  // passport.authenticate("jwt", { session: false }),
  subscribesByUsername
);
router.get(
  "/api/subscribe/suggest",
  passport.authenticate("jwt", { session: false }),
  suggest
);

module.exports = router;
