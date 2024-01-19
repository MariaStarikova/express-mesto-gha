const Card = require("../models/card");
const mongoose = require("mongoose");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const ForbiddenError = require("../errors/forbidden-err");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;

  const newCard = {
    name,
    link,
    owner: req.user._id,
  };

  return Card.create(newCard)
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err, next) => {
      if (err.name === "ValidationError") {
        const badRequestError = new BadRequestError("Переданы некорректные данные при создании карточки.");
        return res.status(badRequestError.statusCode).send({ message: badRequestError.message });
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    const badRequestError = new BadRequestError("Некорректный формат _id карточки.");
    res.status(badRequestError.statusCode).send({ message: badRequestError.message });
  }

  return Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        const notFoundError = new NotFoundError("Карточка с указанным _id не найдена.");
        return res.status(notFoundError.statusCode).send({ message: notFoundError.message });
      }

      if (card.owner !== userId) {
        const forbiddenError = new ForbiddenError("У вас нет прав на удаление этой карточки.");
        return res.status(forbiddenError.statusCode).send({ message: forbiddenError.message });
      }
      return res.status(200).send({ data: card });
    })
    .catch(next);
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const notFoundError = new NotFoundError("Передан несуществующий _id карточки.");
        return res.status(notFoundError.statusCode).send({ message: notFoundError.message });
      }

      return res.send({ data: card });
    })
    .catch((err, next) => {
      if (err.name === "CastError") {
        const badRequestError = new BadRequestError("Переданы некорректные данные для постановки/снятии лайка.");
        return res.status(badRequestError.statusCode).send({ message: badRequestError.message });
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const notFoundError = new NotFoundError("Передан несуществующий _id карточки.");
        return res.status(notFoundError.statusCode).send({ message: notFoundError.message });
      }
      return res.send({ data: card });
    })
    .catch((err, next) => {
      if (err.name === "CastError") {
        const badRequestError = new BadRequestError("Переданы некорректные данные для постановки/снятии лайка.");
        return res.status(badRequestError.statusCode).send({ message: badRequestError.message });
      }
      next(err);
    });
};
