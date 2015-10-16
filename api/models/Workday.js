/**
* Workday.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

const DEFAULT_WORKHOURS = 0;

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
      maxLength: 512,
      defaultsTo: ""
    }
  },
  /**
    @arg {number|Object} userId
    @arg {number} time UNIX timestamp; the beginning of the belonging week gets computed
    @arg {function} cb Callback, err is the only parameter given
  */
  createWorkweek: function (userId, time, cb) {
    if (userId instanceof User) {
      userId = userId.id;
    }

    var weekdays = DateHelper.weekdaysInWeek(time);

    createWeekday(0);

    function createWeekday(index) {
      if (index === 5) {
        return cb(null);
      }

      Workday.create({
        day: weekdays[index],
        userId: userId,
        workhours: DEFAULT_WORKHOURS
      }).exec(function (err) {
        if (err) {
          return cb(err);
        }

        createWeekday(index + 1);
      });
    }
  }
};
