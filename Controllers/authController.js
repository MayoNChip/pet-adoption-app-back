const userService = require("../services/users.service");
const authService = require("../services/auth.service");
const ErrorHandler = require("../libs/errorHandling.lib");

const login = async (req, res, next) => {
	const { email, password } = req.body;

	const userRes = await userService.findByEmail(email);
	const user = userRes[0];

	if (!user?.password) {
		next(ErrorHandler.userNotFound());
		return;
	}
	const valid = authService.validateLogin(password, user?.password);

	if (!valid) {
		next(ErrorHandler.loginFailed());
		return;
	}
	const userId = user._id;
	const ACCESS_TOKEN = authService.generateAccessToken(userId);
	console.log(userId);
	res.send(ACCESS_TOKEN);
};

const register = async (req, res, next) => {
	const usersList = await userService.getAll();
	const hashedPassword = authService.generateHash(req.body.password);
	const user = { ...req.body, password: hashedPassword };
	delete user.repassword;
	if (usersList.find((i) => i.email === user.email)) {
		return next(ErrorHandler.userExists());
	}
	const userId = await userService.add({ ...user });
	const ACCESS_TOKEN = authService.generateAccessToken(userId);

	res.send({
		success: true,
		userId,
		ACCESS_TOKEN,
	});
};

module.exports = { login, register };
