const express = require("express");
const ctrl = require("../controllers/auth");
const { validateBody, authenticate, passport } = require("../middlewares");
const { schemas } = require("../models/user");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),ctrl.googleAuth
);

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/logout", authenticate, ctrl.logout);

module.exports = router;
