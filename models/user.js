const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      required: true,
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

module.exports = mongoose.model("user", userSchema);
