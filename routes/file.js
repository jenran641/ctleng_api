const express = require("express");
const router = express.Router();
const {
  add,
  remove,
  removeone,
  list,
  preview,
  titleUpdate
} = require("../controllers/attachment");

// Require the upload middleware
const upload = require("../controllers/upload");

// Set up a route for file uploads
router.use("/upload", (req, res, next) => {
  req.requestTime = Date.now();
  next();
});

router.post("/upload", upload.single("file"), add);

router.delete("/remove/:id", removeone);

router.post("/remove", remove)

router.put('/', titleUpdate );

router.get("/list/:param2/:param1/:ref_id", list);

router.get("/preview/:filename", preview);

module.exports = router;
