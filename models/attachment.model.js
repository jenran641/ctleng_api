const db = require("./mysqldb.js");
const { isEmplty } = require("../utils/isEmplty.js");

/**
 *  @desc: table
 *  param1: file type
 *  param2: related table
 */

const tblName = "attachments";
const tblFields = [
  "title",
  "originalname",
  "filename",
  "mimetype",
  "ref_id",
  "param1",
  "param2",
];

// constructor
const Attachment = function (file) {
  for (let i = 0; i < tblFields.length; i++)
    file[tblFields[i]] && (this[tblFields[i]] = file[tblFields[i]]);
};

Attachment.create = (newFile, callback) => {
  db.query(`INSERT INTO ${tblName} SET ?`, newFile, (err, res) => {
    if (err) {
      console.log("error: ", err);
      callback(err, null);
    } else {
      callback(null, { id: res.insertId,...newFile});
    }
  });
};

Attachment.findById = (id, callback) => {
  let query = `SELECT * FROM ${tblName} where id=${id}`;
  db.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      callback(err, null);
    } else {
      const data = isEmplty(res) ? null : res[0];
      callback(null, data);
    }
  });
};

Attachment.findByRefId = (ref_id, callback) => {
  let query = `SELECT * FROM ${tblName} where ref_id=${ref_id}`;
  db.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
};

Attachment.remove = (id, callback) => {
  db.query(`DELETE FROM ${tblName} WHERE id=${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      callback(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      callback(null, { kind: "not_found" });
      return;
    }
    callback(null, id);
  });
};

Attachment.find = (data, callback) => {

  let where = `ref_id=${data.ref_id} AND param2='${data.param2}'`

  if(data.param1 != 'all')
    where +=  ` AND param1='${data.param1}'`;

  db.query(
    `SELECT * FROM ${tblName} WHERE ${where} ORDER BY id ASC`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
};

Attachment.updateById = (id, attachment, callback) => {
  let updtFields = "";
  for (let i = 0; i < tblFields.length; i++) {
    if(isEmplty(attachment[tblFields[i]]))
      continue;
    if (i > 0) updtFields += ",";
    updtFields += `${tblFields[i]}="${attachment[tblFields[i]]}"`;
  }

  db.query(
    `UPDATE ${tblName} SET ${updtFields} WHERE id = ${id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        callback(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        callback({ kind: "not_found" }, null);
        return;
      }

      console.log("updated attachment: ", { id: id, ...attachment });
      callback(null, { id: id, ...attachment });
    }
  );
};

Attachment.findByFilename = (filename, callback) => {
  let query = `SELECT * FROM ${tblName} where filename='${filename}'`;
  db.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      callback(err, null);
    } else {
      const data = isEmplty(res) ? null : res[0];
      callback(null, data);
    }
  });
};

module.exports = Attachment;
