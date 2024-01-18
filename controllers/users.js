const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-error");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUsersByTd = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const notFoundError = new NotFoundError("Пользователь с указанным _id не найден.");
        res.status(notFoundError.statusCode).send({ message: notFoundError.message });
      }
      return res.send({ data: user });
    })
    .catch((err, next) => {
      if (err.name === "CastError") {
        const badRequestError = new BadRequestError("Некорректный формат _id пользователя.");
        res.status(badRequestError.statusCode).send({ message: badRequestError.message });
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => User.findById(user._id).select("-password").then((userWithoutPassword) => {
      res.status(201).send({ data: userWithoutPassword });
    }))
    .catch((err, next) => {
      if (err.code === 11000) {
        const conflictError = new ConflictError("Пользователь с таким email уже существует!");
        res.status(conflictError.statusCode).send({ message: conflictError.message });
      } else if (err.name === "ValidationError") {
        const badRequestError = new BadRequestError("Переданы некорректные данные при создании пользователя.");
        res.status(badRequestError.statusCode).send({ message: badRequestError.message });
      } else {
        next(err);
      }
    });
};

module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        const notFoundError = new NotFoundError("Пользователь с указанным _id не найден.");
        res.status(notFoundError.statusCode).send({ message: notFoundError.message });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err, next) => {
      if (err.name === "ValidationError") {
        const badRequestError = new BadRequestError("Переданы некорректные данные при обновлении профиля.");
        res.status(badRequestError.statusCode).send({ message: badRequestError.message });
      }
      return next(err);
    });
};

module.exports.patchUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        const notFoundError = new NotFoundError("Пользователь с указанным _id не найден.");
        res.status(notFoundError.statusCode).send({ message: notFoundError.message });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err, next) => {
      if (err.name === "ValidationError") {
        const badRequestError = new BadRequestError("Переданы некорректные данные при обновлении аватара.");
        res.status(badRequestError.statusCode).send({ message: badRequestError.message });
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", { expiresIn: "7d" });

      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).select("-password")
    .then((user) => {
      if (!user) {
        const notFoundError = new NotFoundError("Пользователь не найден.");
        return res.status(notFoundError.statusCode).send({ message: notFoundError.message });
      }
      return res.status(200).send({ data: user });
    })
    .catch(next);
};
