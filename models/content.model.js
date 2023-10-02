const db = require("./mysqldb.js");

const tblName = 'contents';
const tblFields = [
  'content', 'content', 'expert', 'other', 'images', 'page_id'
]

// constructor
const Content = function(content) {
  for(let i=0; i<tblFields.length; i++) 
    this[tblFields[i]] = content[tblFields[i]];
};

Content.create = (newContent, callback) => {
  db.query(`INSERT INTO ${tblName} SET ?`, newContent, (err, res) => {
    if (err) {
      console.log("error: ", err);
      callback(err, null);
    } else {
      callback(null, newContent);
    }
  });
};

Content.findByPageId = (catId, callback) => {
  let query = `SELECT * FROM ${tblName} where page_id=${catId}`;
  db.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
};

Content.updateByPageId = (page_id, content, callback) => {
  let updtFields = '';
  for(let i=0; i<tblFields.length; i++) {
    if( i > 0) updtFields += ',';
    updtFields += `${tblFields[i]}="${content[tblFields[i]]}"`
  }

  db.query(
    `UPDATE ${tblName} SET ${updtFields} WHERE page_id = ${page_id}`,
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

      console.log("updated content: ", { page_id: page_id, ...content });
      callback(null, { page_id: page_id, ...content });
    }
  );
};

Content.remove = (page_id, callback) => {
  db.query(`DELETE FROM ${tblName} WHERE id = ${page_id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      callback(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      callback(null, { kind: "not_found" });
      return;
    }

    console.log("deleted content with page_id: ", page_id);
    callback(null, page_id);
  });
};

module.exports = Content;
