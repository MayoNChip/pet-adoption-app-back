const mongoose = require("mongoose");
const PetDB = require("./pet");

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
  },
  userAdded: {
    type: Date,
    require: true,
    default: Date.now(),
  },
  image: {
    type: String,
    default: "",
  },
  savedPets: [{ type: String, ref: "Pet" }],
  fosteredPets: [{ type: String, ref: "Pet" }],
  adoptedPets: [{ type: String, ref: "Pet" }],
});

userSchema.methods.fosterPet = async (petId) => {
  this.fosteredPets.push(petId);

  await PetDB.findOneAndUpdate({ _id: petId }, { petStatus: "fostered" });

  await this.save();
};

userSchema.methods.forsterPet = async (petId) => {
  if (this.fosteredPets.includs(petId)) {
    this.fosteredPets = this.fosteredPets.filter(
      (p) => p.toSting() !== petId.toSting()
    );
  }

  this.adoptedPets.push(petId);

  await PetDB.findOneAndUpdate({ _id: petId }, { petStatus: "adopted" });

  await this.save();
};

userSchema.methods.adoptPet = async (petId) => {
  const petLocation = (() => {
    if (this.fosteredPets.includs(petId)) return "fosteredPets";
    if (this.adoptedPets.includs(petId)) return "adoptedPets";
    throw new Error("Pet is not saved by the user in any way");
  })();

  this[petLocation] = this[petLocation].filter(
    (f) => f.toSting() !== petId.toSting()
  );

  await Pet.findOneAndUpdate({ _id: petId }, { status: "not-adopted" });

  await this.save();
};

module.exports = mongoose.model("users", userSchema);
