/**
 * TimeTrackingController
 *
 * @description :: Server-side logic for managing Timetrackings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var log = require('captains-log')();

module.exports = {
	addNextWeek: function (req, res) {
		var userId = req.session.me.id;
		Workday.getMostRecentWorkday(userId, function (err, workday) {
			if (err) {
				log(err);
				return res.negotiate(err);
			}

			var dayInNextWeek = DateHelper.getDayInNextWeek(workday);

			Workday.createWorkweek(userId, dayInNextWeek, function (err) {
				if (err) {
					log(err);
					return res.negotiate(err);
				}

				res.send(201);
			});
		});
	},
	getWorkweek: function (req, res) {
    var time = req.param("time");
    var userId = req.session.me.id;

    TimeTrackingHelper.getWorkweekWithMetadata(userId, time, function (err, workdays, beginOfPrevWeek, beginOfNextWeek) {
      if (err) {
        log(err);
        return res.send(400, {
          msg: "Cannot provide data for the given timeframe-user-combination."
        });
      }

      res.send(200, {
        workdays: workdays,
        _meta: {
          previousWeek: beginOfPrevWeek,
          subsequentWeek: beginOfNextWeek
        }
      });
    });
	},
	getMostRecentWorkweek: function (req, res) { //Redirects to getWorkweek() by redirecting to its url
    var userId = req.session.me.id;
    Workday.getMostRecentWorkday(userId, function (err, workday) {
      if (err) {
        log(err);
        return res.send(400, {
          msg: "Cannot find the most recent workday for this user - did the initialization succeed at all?"
        });
      }

      res.redirect("/workweek/" + workday.day);
    });
	},
  getWorkday: function (req, res) {
    var userId = req.session.me.id;
    var time = req.param("time");

    Workday.findOne({
      where: {
        day: time,
        userId: userId
      }
    }).exec(function (err, workday) {
      if (err) {
        log(err);
        return res.negotiate(err);
      }

      res.send(200, workday);
    });
  },
  updateWorkday: function (req, res) {
    var userId = req.session.me.id;
    var time = req.param("time");

    var updatedWorkday = req.body;
    updatedWorkday.day = time;
    updatedWorkday.userId = userId;

    Workday.update({
      day: time,
      userId: userId
    }, updatedWorkday).exec(function (err, workday) {
      if (err) {
        log(err);
        return res.negotiate(err);
      }

      if (workday.length === 0) {
        return res.send(400, {
          msg: "There is no appropriate workday for this user at this time!"
        });
      }

      res.send(200, workday[0]);
    });
  }
};
