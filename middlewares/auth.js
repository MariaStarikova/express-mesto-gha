const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized-err");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Необходима авторизация");
    // const unauthorizedError = new UnauthorizedError("Необходима авторизация");
    // res.status(unauthorizedError.statusCode).send({ message: unauthorizedError.message });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    throw new UnauthorizedError("Необходима авторизация");
    // const unauthorizedError = new UnauthorizedError("Необходима авторизация");
    // res.status(unauthorizedError.statusCode).send({ message: unauthorizedError.message });
  }

  req.user = payload;

  return next();
};
