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
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().custom(checkUrl, "Некорректный формат URL").required(),
  }),
});

const validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validationCard,
  validationCardId,
};
