const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  subscribeById,
  subscribeByUsername,
  subscribesToUsername,
  subscribesByUsername,
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
  passport.authenticate("jwt", { session: false }),
  subscribesToUsername
);
router.get(
  "/api/subscribe/by/byUsername/:username",
  passport.authenticate("jwt", { session: false }),
  subscribesByUsername
);

module.exports = router;
