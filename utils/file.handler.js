const {
  IMAGE_URL,
  VIDEO_URL,
  ATTACHMENT_URL,
} = require("../config/file.config");

const getFileUrlByType = (mimetype) => {
  switch (mimetype.split("/")[0]) {
    case "image":
      return IMAGE_URL;
    case "video":
      return VIDEO_URL;
    default:
      return ATTACHMENT_URL;
  }
};

module.exports = {
    getFileUrlByType
}
