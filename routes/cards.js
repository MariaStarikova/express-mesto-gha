const router = require("express").Router();
const {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");
const { validationCard } = require("../middlewares/validationCard");

router.get("/", getCards);
router.post("/", validationCard, postCard);
router.delete("/:cardId", deleteCard);
router.put("/:cardId/likes", likeCard);
router.delete("/:cardId/likes", dislikeCard);

module.exports = router;
