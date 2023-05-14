const mongoose = require("mongoose");

const permiossionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  permission: {
    type: Number,
    required: true,
  },
  _id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("permissions", permiossionSchema);
