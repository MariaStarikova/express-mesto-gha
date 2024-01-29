const express = require("express");
const mongoose = require("mongoose");
const routers = require("./routes/index");
const handlerErrors = require("./middlewares/handlerErrors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");


 const { PORT = 3000 } = process.env;

const app = express();

const allowedCors = [
  "http://mstar.students.nomoredomainsmonster.ru/",
  "https://mstar.students.nomoredomainsmonster.ru/",
  "http://api.mstar.students.nomoredomainsmonster.ru/",
  "https://api.mstar.students.nomoredomainsmonster.ru/",
  "http://localhost:3000",
  "https://localhost:3000"
];

app.use(function(req, res, next) {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых

  if (allowedCors.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

  // сохраняем список заголовков исходного запроса
  const requestHeaders = req.headers["access-control-request-headers"];



  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === "OPTIONS") {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header("Access-Control-Allow-Headers", requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }

  // res.header("Access-Control-Allow-Origin", "*");

  return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(routers);

app.use(errorLogger);

app.use(errors());
app.use(handlerErrors);

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
}).then(() => {
  console.log("'соединение с базой установлено");
})
  .catch((err) => {
    console.log("V5");
    console.log(`DB connection error:${err}`);
    console.log("'соединение с базой прервано");
    // process.exit(1);
  });

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log("V7");
  console.log(`App listening on port ${PORT}`);
});


