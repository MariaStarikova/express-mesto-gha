const Card = require("../models/card");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const ForbiddenError = require("../errors/forbidden-err");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.postCard = (req, res, next) => {
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
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Переданы некорректные данные при создании карточки."));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById({ _id: cardId })
    .orFail(() => {
      throw new NotFoundError("Передан несуществующий _id карточки.");
    })
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new ForbiddenError("У вас нет прав на удаление этой карточки.");
      }
      return Card.findByIdAndDelete(card._id);
    })
    .then((card) => {
      res.status(200).send({ message: "Успешно удалена карточка:", data: card });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Передан несуществующий _id карточки.");
      }

      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Переданы некорректные данные для постановки/снятии лайка."));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Передан несуществующий _id карточки.");
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Переданы некорректные данные для постановки/снятии лайка."));
      }
      return next(err);
    });
};
