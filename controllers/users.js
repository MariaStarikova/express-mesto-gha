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

module.exports.getUsersByTd = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
.orFail(() => {
  throw new NotFoundError("Пользователь по указанному _id не найден");
})
.then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Пользователь с некорректным id"));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => User.findById(user._id).select("-password").then((userWithoutPassword) => {
      return res.status(201).send({ data: userWithoutPassword });
    }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Переданы некорректные данные при создании пользователя."));
      } else if (err.code === 11000) {
        return next(new ConflictError("Пользователь с таким email уже существует!"));
      }  else {
        return next(err);
      }
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь по указанному _id не найден");
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Переданы некорректные данные при обновлении пользователя."));
      } else {
        return next(err);
      }
    });
};

module.exports.patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь по указанному _id не найден");
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Переданы некорректные данные при обновлении аватара."));
      }  else {
      return next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", { expiresIn: "7d" });

      return res.status(200).json({ token });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).select("-password")
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь не найден");
      }
      return res.status(200).send({ data: user });
    })
    .catch(next);
};
