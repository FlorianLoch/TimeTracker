const HOURS_PER_DAY = 4;

module.exports = {
  /**
    @arg {number|Object} userId
    @arg {number} time UNIX timestamp
    @arg {function} cb Callback, (err, workdays -model instances-, beginOfPrevWeek -timestamp-, beginOfNextWeek -timestamp-)
  */
  getWorkweekWithMetadata: function (userId, time, cb) {
    if (typeof userId === "object") {
      userId = userId.id;
    }

    Workday.getWorkweek(userId, time, function (err, workdays) {
      if (err) {
        return cb(err);
      }

      var dayInWeekBefore = workdays[0].day - 7 * DateHelper.DAY_MS;
      var dayInWeekAfter = workdays[0].day + 7 * DateHelper.DAY_MS;

      Workday.find({
        where: {
          day: [dayInWeekBefore, dayInWeekAfter],
          userId: userId
        },
        sort: "day ASC"
      }).exec(function (err, workdaysInner) {
        if (err) {
          return cb(err);
        }

        var beginOfNextWeek = null;
        var beginOfPrevWeek = null;

        if (workdaysInner.length === 1) {
          if (workdaysInner[0].day === dayInWeekBefore) {
            beginOfPrevWeek = workdaysInner[0].day;
          }
          else {
            beginOfNextWeek = workdaysInner[0].day;
          }
        }
        else if (workdaysInner.length === 2) {
          beginOfPrevWeek = workdaysInner[0].day;
          beginOfNextWeek = workdaysInner[1].day;
        }

        cb(null, workdays, beginOfPrevWeek, beginOfNextWeek);
      });
    });
  },
  /**
    @arg {number|Object} userId
    @arg {number} time UNIX timestamp, when falsy all entries will be taken into account
    @arg {function} cb Callback, (err, overtime (might be negative in case of too few workhours))
  */
  sumUpWorktime: function (userId, time, cb) {
    var whereCriteria = {
      userId: userId
    };

    if (typeof time === "string") {
      time = parseInt(time);
    }

    if (time) {
      whereCriteria.day = {
        "<=": time
      };
    }

    Workday.find({where: whereCriteria}).exec(function (err, workdays) {
      if (err) {
        return cb(err);
      }

      var expectedHours = workdays.length * HOURS_PER_DAY;
      var actualHours = workdays.reduce(function (accu, workday) {
        return accu + workday.workhours;
      }, 0);

      cb(null, actualHours - expectedHours);
    });
  }
};
