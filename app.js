const express = require("express");
const mongoose = require("mongoose");
const {
  createUser,
  login,
} = require("./controllers/users");
const auth = require("./middlewares/auth");
const { validationUser } = require("./middlewares/validationUser");
const NotFoundError = require("./errors/not-found-err");
const handlerErrors = require("./middlewares/handlerErrors");
const { errors } = require("celebrate");
// const joiErrorHandler = require("./middlewares/joi");

 const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.post("/signup", validationUser, createUser);
app.post("/signin", validationUser, login);
app.use("/users", auth, require("./routes/users"));
app.use("/cards", auth, require("./routes/cards"));



app.use((req, res, next) => {
  next(new NotFoundError("Запрашиваемый маршрут не найден"));
});

// app.use(joiErrorHandler);
app.use(errors());
app.use(handlerErrors);


mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
}).then(() => {
  console.log("'соединение с базой установлено");
})
  .catch(() => {
    console.log("'соединение с базой прервано");
    process.exit(1);
  });

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});


