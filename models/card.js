const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator(link) {
          return /^https?:\/\/[-a-zA-Z0-9@:%._\\+~#?&//=]+\.[a-z]{2,6}[-a-zA-Z0-9@:%._\\+~#?&//=]*$/.test(link);
        },
        message: "Некорректный формат URL",
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model("card", cardSchema);
