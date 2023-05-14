class ErrorHandler {
  constructor(status, msg) {
    this.status = status;
    this.msg = msg;
  }

  static needLogin = () => {
    return new ErrorHandler(401, "You need to login");
  };
  static userNotFound = () => {
    return new ErrorHandler(404, "User does not exist, Try registering first");
  };
  static userExists = () => {
    return new ErrorHandler(409, "User with this Email already exists.");
  };
  static loginFailed = () => {
    return new ErrorHandler(403, "Wrong Password");
  };
}
module.exports = ErrorHandler;
