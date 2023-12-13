const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() =>
      res
        .status(500)
        .send({ message: `Произошла ошибка GET запроса: ${err.message}` })
    );
};

module.exports.getUsersByTd = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res
        .status(404)
        .send({ message: "Пользователь по указанному _id не найден." });
      res
        .status(500)
        .send({
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

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      console.error("Error creating user:", error);
      res
        .status(500)
        .send({ message: `Произошла ошибка POST запроса: ${error.message}` });
    });
};

module.exports.patchUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      res.status(400).send({
        message: "Переданы некорректные данные при обновлении профиля.",
      });
      res
        .status(404)
        .send({ message: "Пользователь с указанным _id не найден." });
      res
        .status(500)
        .send({ message: `Произошла ошибка PATCH запроса: ${err.message}` });
    });
};

module.exports.patchUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      res.status(400).send({
        message: "Переданы некорректные данные при обновлении аватара.",
      });
      res
        .status(404)
        .send({ message: "Пользователь с указанным _id не найден." });
      res
        .status(500)
        .send({ message: `Произошла ошибка PATCH запроса: ${err.message}` });
    });
};