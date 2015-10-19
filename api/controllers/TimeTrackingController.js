/**
 * TimeTrackingController
 *
 * @description :: Server-side logic for managing Timetrackings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var log = require('captains-log')();

module.exports = {
	addNextWeek: function (res, req) {
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
	getWorkweek: function (res, req) {

	},
	getMostRecentWeek: function (res, req) {
		//getWorkweekWithMetadata...
	}
};
