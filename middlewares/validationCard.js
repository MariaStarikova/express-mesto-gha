const { celebrate, Joi } = require("celebrate");

const validationCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
  }),
});

module.exports = {
  validationCard,
};
