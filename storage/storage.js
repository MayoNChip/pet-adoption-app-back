const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");
const multer = require("multer");
const PORT = 5000;

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// const upload = multer({
//   dest: "/public/pets",
// });

const petsStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "../public/");
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split("/")[1];
    callback(null, `${nanoid()}.${ext}`);
  },
});

const petsUpload = multer({ storage: petsStorage });

app.post("/upload/pets", petsUpload.single("image"), (req, res) => {
  res.send("uploaded");
});

app.listen(PORT, () => {
  console.log(`our storage server is running on port: ${PORT}`);
});
