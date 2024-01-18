const router = require("express").Router();
const {
  getUsers,
  getUsersByTd,
  patchUser,
  patchUserAvatar,
  getCurrentUser,
} = require("../controllers/users");
const {
  validationUser,
  validationUpdateUser,
  validationUpdateAvatar,
} = require("../middlewares/validationUser");

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get("/:userId", validationUser, getUsersByTd);
router.patch("/me", validationUpdateUser, patchUser);
router.patch("/me/avatar", validationUpdateAvatar, patchUserAvatar);

module.exports = router;
