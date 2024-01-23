const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UnauthorizedError = require("../errors/unauthorized-err");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 30,
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 30,
      default: "Исследователь",
    },
    avatar: {
      type: String,
      required: false,
      default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        validator(avatar) {
          return /^https?:\/\/[-a-zA-Z0-9@:%._\\+~#?&//=]+\.[a-z]{2,6}[-a-zA-Z0-9@:%._\\+~#?&//=]*$/.test(avatar);
        },
        message: "Некорректный формат URL",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  const { _id, ...rest } = userObject;
  return { ...rest, _id };
};

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError("Неправильные почта или пароль"));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError("Неправильные почта или пароль"));
          }

          return user;
        })
    })
};

module.exports = mongoose.model("user", userSchema);
