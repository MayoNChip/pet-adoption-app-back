require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  //   cloud_name: process.env.CLOUDINARY_NAME,
  //   api_key: process.env.CLOUDINARY_API_KEY,
  //   api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: "dmpvdg7al",
  api_key: "645883948685422",
  api_secret: "gI1NiE_POmPq1U9FyKWGi02ggJ0",
});

module.exports = { cloudinary };
