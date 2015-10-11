/**
* Workday.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    day: {
      type: "integer",
      required: true
    },
    userId: {
      model: "user",
      required: true
    },
    workhours: {
      type: "integer",
      min: 0,
      max: 24,
      required: true
    },
    comment: {
      type: "string",
      size: 512,
      maxLength: 512
    }
  },
  createWorkWeek: function (userId, cb) {
    

    //Create workdays for the current week
  }
};
