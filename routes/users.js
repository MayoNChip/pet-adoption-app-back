const express = require("express");
const router = express.Router();
const DB = require("../Controllers/db");
const authRegisterSchema = require("../Controllers/dto/auth/auth.register.schema");
const validateReq = require("../Controllers/dto/validator");
const usersController = require("../Controllers/usersController");
const authValidate = require("../middlewares/authValidate");

router.use(authValidate.authValidate);

router.get("/me", usersController.getMe);

router.get("/mypets/", usersController.getMyPets);

router.get("/", usersController.getUsers);

router.get("/:userId", usersController.getById);

router.get("/userPets/:userId", usersController.getPetsByUser);

router.post("/", validateReq(authRegisterSchema), usersController.addNew);

router.put("/", usersController.updatePassword);

router.put("/:userId", usersController.update);

router.put("/savepet/:petId", usersController.addSavedPet);

router.patch("/:userId", usersController.updateCol);

router.delete("/:userId", usersController.deleteUser);

module.exports = router;
