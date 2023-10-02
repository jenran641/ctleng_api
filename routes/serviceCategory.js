const express = require("express");
const router = express.Router();

const { list, relpost, getByUrl } = require("../controllers/serviceCategory");

router.get("/relpost/:types", relpost);
router.get("/byurl", getByUrl);
router.get("/:selFields?", list);

module.exports = router;
