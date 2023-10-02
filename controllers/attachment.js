const Attachment = require("../models/attachment.model");
const fs = require("fs");
const path = require("path");
const { isEmplty } = require("../utils/isEmplty");
const { getFileUrlByType } = require("../utils/file.handler");

const {
  IMAGE_URL,
  VIDEO_URL,
  ATTACHMENT_URL,
} = require("../config/file.config");

const URLS = {
  0: ATTACHMENT_URL,
  1: IMAGE_URL,
  2: VIDEO_URL,
};

const removeFileById = (id, callback) => {
  Attachment.findById(id, (err, file) => {
    if (isEmplty(file)) return callback();

    let filePath = getFileUrlByType(file.mimetype) + file.filename;

    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        console.log(`Delete ${file.filename} success!`);
      });
    }

    callback();
  });
};

const dataFields = [
  "title",
  "originalname",
  "filename",
  "ref_id",
  "param1",
  "param2",
  "mimetype",
];

const getDataFromBody = (body) => {
  let _data = {};
  dataFields.forEach((field) => {
    _data[field] = body[field] ? body[field] : "";
  });

  return _data;
};

// Set up a route for file uploads

const add = (req, res) => {
  let { id, ref_id, title, param2 } = req.body;
  title = title ? title : "";
  param2 = param2 ? param2 : "";
  let mimetype = req.file.mimetype;
  let param1 = "";
  switch (mimetype.split("/")[0]) {
    case "image":
      param1 = 1;
      break;
    case "video":
      param1 = 2;
      break;
    default:
      param1 = 0;
  }

  const newFile = {
    originalname: req.file.originalname,
    filename: req.requestTime + "_" + req.file.originalname,
    mimetype,
    ref_id,
    title,
    param1,
    param2,
  };

  if (isEmplty(id)) {
    Attachment.create(newFile, (err, data) => {
      return isEmplty(err)
        ? res.send({ message: "File uploaded successfully!", data })
        : res.send({ message: "Can't upload!" });
    });
  } else {
    removeFileById(id, () => {
      Attachment.updateById(id, newFile, (err) => {
        return isEmplty(err)
          ? res.send({
              message: "File uploaded successfully!",
              data: {
                ...newFile,
                id,
              },
            })
          : res.send({ message: "Can't upload!" });
      });
    });
  }
};

const removeone = (req, res) => {
  const { id } = req.params;

  removeFileById(id, () => {
    Attachment.remove(id, (err, ressult) => {
      console.log(`Delete ${id}`);
    });
  });
  res.json({ message: "Success delete!" });
};

const remove = (req, res) => {
  const { ids } = req.body;

  ids.forEach((id) => {
    removeFileById(id, () => {
      Attachment.remove(id, (err, ressult) => {
        console.log(`Delete ${id}`);
      });
    });
  });

  res.json({ message: "Success delete!" });
};

const list = (req, res) => {
  const data = ({ param1, param2, ref_id } = req.params);

  console.log(req.params);

  Attachment.find(data, (err, resulte) => {
    return isEmplty(err)
      ? res.send({ success: "true", data: resulte })
      : res.send({ success: "false" });
  });
};

const preview = (req, res) => {
  let { filename } = req.params;
  Attachment.findByFilename(filename, (err, file) => {
    if (err || isEmplty(file)) {
      console.log("Can't find file"+filename)
      return res.send({
        success: "false",
        message: "Can't find file"+filename,
      });
    } else {
      const _URL = URLS[file.param1];

      const FILE_PATH = _URL + filename;

      if (fs.existsSync(FILE_PATH)) {
        const options = {
          root: path.join(__dirname, `../${_URL}`),
        };

        return res.sendFile(filename, options, function (err) {
          if (err) {
            console.log(err.message);
          } else {
            console.log("Sent:", filename);
          }
        });
      }

      return res.send({ message: "There is no iamge" });
    }
  });
};

const titleUpdate = (req, res) => {
  const { id } = req.body;
  const data = getDataFromBody(req.body);

  Attachment.updateById(id, data, (err) => {
    return isEmplty(err)
      ? res.send({ message: "File uploaded successfully!" })
      : res.send({ message: "Can't upload!" });
  });
};

module.exports = {
  add,
  remove,
  removeone,
  list,
  preview,
  titleUpdate,
};
