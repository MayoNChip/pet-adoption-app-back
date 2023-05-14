const mongoose = require("mongoose");
// const UserDB = require("./User");

const petSchema = new mongoose.Schema({
  _id: { type: String, require: true },
  image: {
    type: String,
    required: true,
  },
  petType: { type: String, require: true },
  age: { type: Number, require: true },
  breed: { type: String, require: true },
  breed2: { type: String },
  petStatus: { type: String, require: true },
  height: { type: Number, require: true },
  weight: { type: Number, require: true },
  color: { type: String, require: true },
  petBio: { type: String },
  name: { type: String, require: true },
  diet: { type: String },
  hypoallergenic: { type: Boolean, require: true },
  petAdded: {
    type: Date,
    require: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model("pets", petSchema);
