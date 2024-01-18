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

// const { PORT = 3000 } = process.env;
const {
  PORT = 3000,
  MONGO_URL = "mongodb://localhost:27017/mestodb",
} = process.env;

const app = express();

// подключаемся к серверу mongo
// mongoose.connect("mongodb://localhost:27017/mestodb", {
//   useNewUrlParser: true,
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/signup", validationUser, createUser);
app.post("/signin", validationUser, login);
app.use("/cards", auth, require("./routes/cards"));
app.use("/users", auth, require("./routes/users"));

app.use(errors());
app.use((req, res, next) => {
  next(new NotFoundError("Запрашиваемый маршрут не найден"));
});
app.use(handlerErrors);

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect("mongodb://localhost:27017/mestodb", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (err) {
//     console.log(`Error: ${err.message}`);
//     process.exit(1);
//   }
// };
// connectDB();

async function init() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
  });
  console.log("'соединение с базой установлено'");

  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
}

init();

// app.listen(PORT, () => {
//   // Если всё работает, консоль покажет, какой порт приложение слушает
//   console.log(`App listening on port ${PORT}`);
// });
