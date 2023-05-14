const { resetErrorsCount } = require("ajv/dist/compile/errors");
const express = require("express");
const route = express.Router();
const { cloudinary } = require("../libs/cloudinary");
const {
  uploadPetImage,
  uploadUserImage,
} = require("../services/upload.service");

route.post("/pet/:petId", uploadPetImage);

route.post("/user/:userId", uploadUserImage);

module.exports = route;
