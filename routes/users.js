const router = require("express").Router();
const {
  getUsers,
  getUsersByTd,
  patchUser,
  patchUserAvatar,
  getCurrentUser,
} = require("../controllers/users");
const {
  validationUpdateUser,
  validationUpdateAvatar,
  validationUserId,
} = require("../middlewares/validationUser");

router.get("/", getUsers);
router.get("/", getCurrentUser);
router.get("/:userId", validationUserId, getUsersByTd);
router.patch("/", validationUpdateUser, patchUser);
router.patch("/me/avatar", validationUpdateAvatar, patchUserAvatar);

module.exports = router;
