require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const mongoose = require("mongoose");

const app = express();
const PORT = 4000;
mongoose.connect(
	"mongodb+srv://idoic44:Icoh9542021@bestpals.rwxk6ux.mongodb.net/"

	// "mongodb+srv://admin:Icoh954202@cluster0.4sxqr.mongodb.net/best_pals"
);
const DB = mongoose.connection;
DB.once("open", () => console.log("Connected to DB"));

app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		// to support URL-encoded bodies
		extended: true,
	})
);

/////////settings section/////////

app.use(cors({ origin: "https://pet-adoption-app-front.vercel.app/" }));

/////////ROUTES/////////

app.get("/", (res, req) => {
	res.send("Healthy");
});

app.use("/upload", require("./routes/upload"));
// app.use(express.static(`${__dirname}/public/`));

app.use("/pets", require("./routes/pets"));
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));

app.use((err, req, res, next) => {
	const { status, msg } = err;
	res.status(status).send({
		error: true,
		message: msg,
	});
});

app.listen(PORT, () => {
	console.log(`Server is listening on ${PORT}`);
});
