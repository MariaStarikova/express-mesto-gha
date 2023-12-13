const router = require("express").Router();
const {
  getUsers,
  getUsersByTd,
  postUser,
  patchUser,
  patchUserAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUsersByTd);
router.post("/", postUser);
router.patch("/me", patchUser);
router.patch("/me/avatar", patchUserAvatar);

module.exports = router;
