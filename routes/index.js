const router = require("express").Router();
const {
  createUser,
  login,
} = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validationCreateUser, validationLogin } = require("../middlewares/validationUser");
const NotFoundError = require("../errors/not-found-err");

router.post("/signup", validationCreateUser, createUser);
router.post("/signin", validationLogin, login);
router.use("/users", auth, require("./users"));
router.use("/cards", auth, require("./cards"));

router.use((req, res, next) => {
  next(new NotFoundError("Запрашиваемый маршрут не найден"));
});

module.exports = router;