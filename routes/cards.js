const router = require("express").Router();
const {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");
const { validationCard, validationCardId } = require("../middlewares/validationCard");

router.get("/", getCards);
router.post("/", validationCard, postCard);
router.delete("/:cardId", validationCardId, deleteCard);
router.put("/:cardId/likes", validationCardId, likeCard);
router.delete("/:cardId/likes", validationCardId, dislikeCard);

module.exports = router;
