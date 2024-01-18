const router = require("express").Router();
const {
  getUsers,
  getUsersByTd,
  patchUser,
  patchUserAvatar,
  getCurrentUser,
} = require("../controllers/users");
const {
  validationUserId,
} = require("../middlewares/validationUser");

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get("/:userId", validationUserId, getUsersByTd);
router.patch("/me", patchUser);
router.patch("/me/avatar", patchUserAvatar);

module.exports = router;
