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

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.post("/signin", validationUser, login);
app.post("/signup", validationUser, createUser);
app.use("/cards", auth, require("./routes/cards"));
app.use("/users", auth, require("./routes/users"));

app.use(errors());
app.use((req, res, next) => {
  next(new NotFoundError("Запрашиваемый маршрут не найден"));
});
app.use(handlerErrors);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
