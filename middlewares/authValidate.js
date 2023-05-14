const jwt = require("jsonwebtoken");
const ErrorHandler = require("../libs/errorHandling.lib");
const secret = "123456";
const userService = require("../services/users.service");
const PermissionsDB = require("../models/permission");

const authValidate = async (req, res, next) => {
  const petId = req.url.slice(6);

  const token = req.headers["authorization"];
  jwt.verify(token, secret, async (err, decoded) => {
    if (err) {
      if (err.message === `jwt malformed`) {
        next({ msg: "wrong token", status: 401 });
        return;
      } else {
        next(ErrorHandler.needLogin());
        return;
      }
    }

    const user = await userService.getById(decoded.userId);

    try {
      const userPermission = await PermissionsDB.find({
        userId: decoded.userId,
      });
      const permission = userPermission[0].permission;
      if (user) {
        req.user = { ...user._doc, permission: permission };
      } else {
        next(ErrorHandler.needLogin);
      }
    } catch (err) {
      console.log("get permission failed=>", err);
    }

    next();
    return;
  });
};

module.exports = { authValidate };
