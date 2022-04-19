const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauceCtrl");

router.get("/", sauceCtrl.getAllSauce);

router.get("/:id", sauceCtrl.getOneSauce);

router.post("/", sauceCtrl.creatSauce);

router.put("/:id", sauceCtrl.modifySauce);

router.delete("/:id", sauceCtrl.deleteSauce);

router.post("/:id/like", sauceCtrl.likeDisliked);

module.exports = router;
