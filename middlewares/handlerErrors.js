const handlerErrors = (err, req, res, next) => {
  const { statusCode = 500, message = "На сервере произошла ошибка" } = err;

  res
    .status(statusCode)
    .send({
      message: `${statusCode} ${message}`,
    });

    // if (err.name === "ValidationError") {
    //   res.status(400).send({
    //     message: "Переданы некорректные данные при обновлении пользователя.",
    //   });
    //   return;
    // }
  next();
};

module.exports = handlerErrors;

