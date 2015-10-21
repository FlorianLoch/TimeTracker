/**
 * AuthController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var log = require('captains-log')();

module.exports = {
	signup: function (req, res) {
		var startTime = req.body.startTimestamp;

		if (!startTime) {
			return res.send(400, {
				msg: "'startTimestamp' needs to be given."
			});
		}

		User.create(req.body).exec(function (err, user) {
			if (err) {
				log(err);
				return res.negotiate(err);
			}

			Workday.createWorkweek(user, startTime, function (err) {
				if (err) {
					log(err);
					return res.negotiate(err);
				}

				_setLoginState(req, user);

				res.json(201, {
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName
				});
			});
		});
	},
	login: function (req, res) {
		if (req.session.authenticated) {
			return res.ok();
		}

		if (!req.body.email || !req.body.password) {
			return res.badRequest({
				msg: "'email' and 'password' need to be given!"
			});
		}

		User.findOneByEmail(req.body.email).exec(function (err, user) {
			if (err) {
				log(err);
				return res.negotiate(err);
			}

			user.checkPassword(req.body.password, function (err, valid) {
				if (err) {
					log(err);
					return res.negotiate(err);
				}

				if (!valid) {
					return res.status(401).send();
				}

				_setLoginState(req, user);

				res.ok();
			});
		});
	},
	logout: function (req, res) {
		req.session.authenticated = false;
		delete req.session.me;
		res.ok();
	}
};

function _setLoginState(req, user) {
	req.session.authenticated = true;
	req.session.me = {};
	["email", "firstName", "lastName", "id"].forEach(function (key) {
		req.session.me[key] = user[key];
	});
}
