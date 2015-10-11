/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

const SALT_CONST = "io42";

module.exports = {

  attributes: {
    email: {
      type: "email",
      unique: true
    },
    firstName: {
      type: "string",
      required: true
    },
    lastName: {
      type: "string",
      required: true
    },
    password: {
      type: "string",
      required: true,
      columnName: "hashed_password",
      size: 60 //as stated with bcrypt
    },
    workdays: {
      collection: "workday",
      via: "userId"
    },
    hashPassword: function (cb) {
      hashPassword.apply(this, cb);
    },
    checkPassword: function (password, cb) {
      require("bcrypt").compare(password + this.email, this.password, cb);
    }
  },
  beforeCreate: function (values, cb) {
    hashPassword(values, cb);
  }
};

function hashPassword(instance, cb) {
  require("bcrypt").hash(instance.password + instance.email, 10, function (err, hash) {
    if (err) {
      return cb(err, null);
    }
    instance.password = hash;
    cb(null, instance);
  });
}
