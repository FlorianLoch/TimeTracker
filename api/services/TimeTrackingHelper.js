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

      var dayInWeekBefore = workdays[0] - 3 * DateHelper.DAY_MS;
      var dayInWeekAfter = workdays[4] + 3 * DateHelper.DAY_MS;

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
          if (workdaysInner[0].day < dayInWeekBefore) {
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
  }
};
