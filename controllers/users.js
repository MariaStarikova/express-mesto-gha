const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res
      .status(500)
      .send({ message: `Произошла ошибка GET запроса: ${err.message}` }));
};

module.exports.getUsersByTd = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден." });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Некорректный формат _id пользователя." });
      }
      return res.status(500).send({
        message: `Произошла ошибка GET запроса по id: ${err.message}`,
      });
    });
};

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    return res.status(400).send({
      message: "Переданы некорректные данные при создании пользователя.",
    });
  }

  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      }
      return res
        .status(500)
        .send({ message: `Произошла ошибка POST запроса: ${err.message}` });
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
        return res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден." });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      }
      return res
        .status(500)
        .send({ message: `Произошла ошибка PATCH запроса: ${err.message}` });
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
        return res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден." });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении аватара.",
        });
      }
      return res
        .status(500)
        .send({ message: `Произошла ошибка PATCH запроса: ${err.message}` });
    });
};
