const { celebrate, Joi } = require("celebrate");
const isUrl = require("validator/lib/isURL");

const checkUrl = (url) => {
  if (!isUrl(url, { require_protocol: true })) {
    throw new Error("Некорректный формат URL");
  }
  return url;
};

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
})

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(checkUrl, "Некорректный формат URL"),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const validationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(checkUrl, "Некорректный формат URL"),
  }).required(),
});

const validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validationLogin,
  validationCreateUser,
  validationUpdateUser,
  validationUpdateAvatar,
  validationUserId,
};
