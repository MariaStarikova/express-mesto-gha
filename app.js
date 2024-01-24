const express = require("express");
const mongoose = require("mongoose");
const routers = require("./routes/index");
const handlerErrors = require("./middlewares/handlerErrors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

 const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(routers);

app.use(errorLogger);

app.use(errors());
app.use(handlerErrors);

mongoose.connect("mongodb://localhost:27017/mestodb", {
  // useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("'соединение с базой установлено");
})
  .catch(() => {
    console.log("'соединение с базой прервано");
    // process.exit(1);
  });

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});


