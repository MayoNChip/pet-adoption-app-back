const express = require("express");
const route = express.Router();

const authRegisterSchema = require("../Controllers/dto/auth/auth.register.schema");
const authLoginSchema = require("../Controllers/dto/auth/auth.login.schema");
const validateUser = require("../Controllers/dto/validator");
const ErrorHandler = require("../libs/errorHandling.lib");
const authController = require("../Controllers/authController");

route.post(
  "/register",
  // validateUser(authRegisterSchema),
  authController.register
);
route.post("/login", validateUser(authLoginSchema), authController.login);

module.exports = route;
