const Card = require("../models/card");
const mongoose = require("mongoose");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() =>
      res
        .status(500)
        .send({ message: `Произошла ошибка GET запроса: ${err.message}` })
    );
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;

  if (!name || !link) {
    return res
      .status(400)
      .send({ message: "Переданы некорректные данные при создании карточки." });
  }

  const newCard = {
    name,
    link,
    owner: req.user._id,
  };

  Card.create(newCard)
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании карточки.",
        });
      }
      res
        .status(500)
        .send({ message: `Произошла ошибка POST запроса: ${err.message}` });
    });
};

module.exports.deleteCard = (req, res) => {
  const cardId = req.params.cardId;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res
      .status(400)
      .send({ message: "Некорректный формат _id карточки." });
  }

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: "Карточка с указанным _id не найдена." });
      }
      res.send({ data: card });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: `Произошла ошибка DELETE запроса: ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: "Передан несуществующий _id карточки." });
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные для постановки/снятии лайка.",
        });
      }
      res
        .status(500)
        .send({ message: `Произошла ошибка PUT запроса: ${err.message}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: "Передан несуществующий _id карточки." });
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные для постановки/снятии лайка.",
        });
      }
      res
        .status(500)
        .send({ message: `Произошла ошибка DELETE запроса: ${err.message}` });
    });
};
