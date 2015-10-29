/**
* Workday.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

/*
  DO NOT CREATE SINGLE DAY-ENTRIES!
  ONLY CREATE WEEK-WISE BY PROVIDED CLASS METHODS!
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
    @arg {number} defaultWorkhours Parameter for internal testing purposes, defaults to DEFAULT_WORKHOURS
  */
  createWorkweek: function (userId, time, cb, defaultWorkhours) {
    if (typeof userId === "object") {
      userId = userId.id;
    }

    if (defaultWorkhours === undefined) {
      defaultWorkhours = DEFAULT_WORKHOURS;
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
        workhours: defaultWorkhours
      }).exec(function (err) {
        if (err) {
          return cb(err);
        }

        createWeekday(index + 1);
      });
    }
  },
  /**
    @arg {number|Object} userId
    @arg {function} cb Callback, (err, workday)
  */
  getMostRecentWorkday: function (userId, cb) {
    if (typeof userId === "object") {
      userId = userId.id;
    }

    Workday.find({
      where: {
        userId: userId
      },
      sort: "day DESC",
      limit: 1
    }).exec(function (err, workdays) { //workdays is a list with just one element
      cb(err, workdays[0]);
    });
  },
  /**
    @arg {number|Object} userId
    @arg {number} time UNIX timestamp
    @arg {function} cb Callback, (err, workdays)
  */
  getWorkweek: function (userId, time, cb) {
    if (typeof userId === "object") {
      userId = userId.id;
    }

    var daysInWeek = DateHelper.weekdaysInWeek(time);

    Workday.find({
      day: daysInWeek,
      userId: userId
    }).exec(function (err, workdays) {
      if (err) {
        return cb(err);
      }

      if (workdays.length === 0) {
        return cb(new Error("Workweek does not exist for this user!"), []);
      }

      cb(null, workdays);
    });
  }
};
