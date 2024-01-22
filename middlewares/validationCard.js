const { celebrate, Joi } = require("celebrate");
const isUrl = require("validator/lib/isURL");

const checkUrl = (url) => {
  if (!isUrl(url, { require_protocol: true })) {
    throw new Error("Некорректный формат URL");
  }
  return url;
};

const validationCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(checkUrl, "Некорректный формат URL"),
  }),
});

const validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validationCard,
  validationCardId,
};
