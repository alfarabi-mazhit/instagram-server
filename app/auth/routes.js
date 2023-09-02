const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  sendVerificationEmail,
  verifyCode,
  signUp,
  signIn,
  editUser,
  findUserByUsername,
  findUserById,
} = require("./controllers");
const { validateSignUp, validateEditUser } = require("./middlewares");
const { upload } = require("./utils");

router.post("/api/auth/sendmail", sendVerificationEmail);
router.post("/api/auth/verifycode", verifyCode);
router.post("/api/auth/signup", validateSignUp, signUp, sendVerificationEmail);
router.post("/api/auth/signin", signIn);
router.put(
  "/api/user/",
  passport.authenticate("jwt", { session: false }),
  validateEditUser,
  upload.single("photo"),
  editUser
);
router.get(
  "/api/user/byUsername/:username",
  // passport.authenticate("jwt", { session: false }),
  findUserByUsername
);
router.get(
  "/api/user/:id",
  // passport.authenticate("jwt", { session: false }),
  findUserById
);

module.exports = router;
