const multer = require("multer");
const { getFileUrlByType } = require("../utils/file.handler");

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getFileUrlByType(file.mimetype));
  },
  filename: (req, file, cb) => {
    cb(null, req.requestTime + "_" + file.originalname);
  },
});

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload;
