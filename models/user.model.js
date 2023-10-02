const db = require("./mysqldb.js");
const async = require('async');
const bcrypt = require('bcrypt');

const tblName = 'users';
const tblFields = [
  'username', 'email', 'password','role'
]

// constructor
const User = function(user) {
  for(let i=0; i<tblFields.length; i++) 
    this[tblFields[i]] = user[tblFields[i]];
};
  
User.create = (newUser, callback) => {
  db.query(`INSERT INTO ${tblName} SET ?`, newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      callback(err, null);
    } else {
      callback(null, { id: res.insertId, ...newUser });
    }
  });
};

User.list = (callback) => {
  db.query(`SELECT * FROM ${tblName} ORDER BY username`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      callback(err, null);
    } else {
      if(res.length > 0) callback(null, res);
      else callback(null, null);
    }
  });
};
  
User.list_noSuper = (callback) => {
  db.query(`SELECT * FROM ${tblName} WHERE role <> 'admin' ORDER BY username`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      callback(err, null);
    } else {
      if(res.length > 0) callback(null, res);
      else callback(null, null);
    }
  });
};

User.findByUsername = (username, callback) => {
  db.query(`SELECT * FROM ${tblName} WHERE username = '${username}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      callback(err, null);
    } else {
      if(res.length > 0) callback(null, res[0]);
      else callback(null, null);
    }
  });
};

User.findByEmail = (email, callback) => {
  db.query(`SELECT * FROM ${tblName} WHERE email = '${email}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      callback(err, null);
    } else {
      if(res.length > 0) callback(null, res[0]);
      else callback(null, null);
    }
  });
};

User.findByUsernameAndPassword = (username, password, callback) => {
  async.waterfall([
    // To find user by username
    function(done) {
      User.findByUsername(username, function(err, user) {
        if(err) {
          done(err);
        }
        else if( !user ) {
          callback(null, null);
          return;
        } {
          done(null, user);
        }
      })
    },
    // To check password
    function(user, done) {
      bcrypt.compare(password, user.password).then(equal => {
        if(equal == true){ 
          callback(null, user);
          return;
        } else {
          callback(null, null);
          return;
        }
      })
    }
  ],
  function(err) {
    callback(err);
  })
}

User.updateById = (id, user, callback) => {
  let updtFields = '';
  for(let i=0; i<tblFields.length; i++) {
    if( i > 0) updtFields += ',';
    updtFields += `${tblFields[i]}="${user[tblFields[i]]}"`
  }

  console.log(`UPDATE ${tblName} SET ${updtFields} WHERE id = ${id}`);
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

      console.log("updated user: ", { id: id, ...user });
      callback(null, { id: id, ...user });
    }
  );
}

User.removeByEmail = (email, callback) => {
  db.query(`DELETE FROM ${tblName} WHERE email = '${email}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      callback(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      callback(null, { kind: "not_found" });
      return;
    }

    console.log("deleted user with email: ", email);
    callback(null, email);
  });
};

module.exports = User;