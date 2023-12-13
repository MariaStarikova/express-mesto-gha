const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: "6579b12dd2f90188ce72bff3", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use("/cards", require("./routes/cards"));
app.use("/users", require("./routes/users"));
app.use((req, res) => {
  res.status(404).json({ message: "Запрашиваемый маршрут не найден" });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
