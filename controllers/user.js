const { compare, compareSync } = require("bcrypt");
const User = require("../models/user.model.js");

const { getLastDayOfMonth } = require("../utils/date.handler.js");
const { compose } = require("async");
const async = require("async");
const bcrypt = require('bcrypt');


const config = require("../config/db.config.js");
const jwt = require('jsonwebtoken');
const {errorHandler} = require("../utils/error.handler.js");





exports.list_noSuper = (req, res, next) => {
  console.log('listing users for the management of users.....')
  
  User.list_noSuper( ( err, data ) => {
    if ( err )
      res.send({
        success: 'false',
        msg: "Some error occurred while retrieving the data."
      });
    else {
      res.send({
        success: 'true',
        data: data
      });}
  });
};

exports.add = (req, res, next) => {
  console.log('add users for the management of users.....')
  
  const {username, email, new_password} = req.body;

  async.series(
    [
      // To check whether the same username already exists.
      function(done) {
        // console.log('checking whether the same username already exists...username=' + username);
        User.findByEmail(email, function(err, user) {
            if(err) {
                done(err);
            } else if(user) {
                res.send({
                    success: 'false',
                    msg: 'The user with the same email already exists!'
                });
                return;
            } else {
                done(null);
            }
        })    
      },
      // To register a new user.
      function(done) {
          // console.log('registering a new user.....');
          bcrypt.hash(new_password, 10).then( (enc_pass) => {
            const newUser = {
                username,
                email,
                password: enc_pass,
                role: 'user'
            };
            // console.log(newUser);
            User.create(newUser, function(err, user) {
                if(err) {
                    done(err);
                }
                else {
                    res.send({
                        success: 'true',
                        msg: 'Added successfully',
                        data: user
                    });
                    done(null);
                }
            })
        });
      }
    ], 
    function(err, user) {
        if(err) {
            errorHandler(err, req, res);
        }
    }
  );
};

exports.update = (req, res, next) => {
  console.log('update users for the management of users.....')
  
  const {username, email, old_password, new_password} = req.body;

  console.log(`username:${username}`);
  console.log(`email:${email}`);
  console.log(`old_password:${old_password}`);
  console.log(`new_password:${new_password}`);

  async.waterfall(
    [
      function(done) {
        User.findByEmail(email, function(err, user) {
            if(err) {
                done(err);
            } else if(user == null) {
                res.send({
                    success: 'false',
                    msg: 'the User not exists!'
                });
                return;
            } else {
              console.log('OOOOOOOOOOOOOOOOO')
              console.log(user);
              done(null, user);
            }
        });
      },
      // To check passwod
      function(user, done) {

        console.log(`old_password:${old_password}`);
        console.log(`user.password:${user.password}`);

          bcrypt.compare(old_password, user.password).then(equal => {
              if(!equal) {
                  res.send({
                      success: 'false',
                      msg: 'Password incorrect'
                  });
                  return;
              } else {
                  done(null, user);
              }
          })
      },

      // To register a new user.
      function(user, done) {
            console.log('registering a new user.....');
            bcrypt.hash(new_password, 10).then( (enc_pass) => {
              const newUser = {
                  id: user.id,
                  username,
                  email,
                  password: enc_pass,
                  role: 'user'
              };
              // console.log(newUser);
              User.updateById(user.id, newUser, function(err, user) {
                  if(err) {
                      done(err);
                  }
                  else {
                      res.send({
                          success: 'true',
                          msg: 'Updated successfully',
                          data: user
                      });
                      done(null);
                  }
              })
          });
      }
    ], 
    function(err, user) {
        if(err) {
            errorHandler(err, req, res);
        }
    }
  );
};

exports.del = ( req, res, next ) => {

  email = req.params.email;
  console.log(req.params)

  console.log('deleting user..... email=' + email);

  User.removeByEmail( email, ( err, data ) => {
    if( err ) {
      res.send({
        success: 'false',
        msg: "Can't find the data."
      });
    } else if( typeof data == "object") {
        res.send({
          success: 'false',
          msg: "There isn't the data"
        })
    } else {
      res.send({
        success: 'true',
        data: data,
        msg: 'Deleted successfully.'
      })
    }
  });
};

