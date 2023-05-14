const express = require("express");
const router = express.Router();
const DB = require("../Controllers/db");
const postPetSchema = require("../Controllers/dto/pets/pets.addPet.schema");
const validator = require("../Controllers/dto/validator");
const petsContoller = require("../Controllers/petsController");
const authValidate = require("../middlewares/authValidate");
const petService = require("../services/pets.service");
const petSchema = require("../models/pet");

const pets = new DB("pets");

router.param("petId", async (req, res, next, petId) => {
  const pet = await petSchema.findById(petId).lean();
  req.pet = pet;
  next();
});
router.get("/", petsContoller.getPets);
router.post("/search", petsContoller.getPetsByFilter);

router.get("/:petId", petsContoller.getById);

router.post("/", validator(postPetSchema), petsContoller.addNew);

router.post(
  "/status/:petId",
  authValidate.authValidate,
  petsContoller.updatePetStatus
);

router.put("/:petId", authValidate.authValidate, petsContoller.update);

router.patch("/:petId", authValidate.authValidate, (req, res) => {
  const data = req.body;
  const petId = req.params.petId;

  pets.updateCol(petId, data.key, data.value);
  res.send(`User ${data.key} updated!`);
});

router.delete("/:petId", authValidate.authValidate, (req, res) => {
  const petId = req.params.petId;
  pets.delete(petId);
  res.send(`User ${petId} Deleted`);
});

module.exports = router;
