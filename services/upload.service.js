const { cloudinary } = require("../libs/cloudinary");

const uploadPetImage = async (req, res, next) => {
  const fileStr = req.body;
  console.log("File ==> ", fileStr);
  try {
    const uploadedResponse = await cloudinary.uploader.upload(fileStr.data, {
      folder: "pets_images",
    });
    res.send({ success: true, imageUrl: uploadedResponse.secure_url });
  } catch (err) {
    console.log("image upload err", err);
    next({ success: false, error: err });
  }
};

const uploadUserImage = async (req, res, next) => {
  const fileStr = req.body;
  try {
    const uploadedResponse = await cloudinary.uploader.upload(fileStr.data, {
      folder: "users_images",
    });
    res.send({ success: true, imageUrl: uploadedResponse.secure_url });
  } catch (err) {
    console.log("image upload err", err);
    next({ success: false, error: err });
  }
};

module.exports = { uploadPetImage, uploadUserImage };
