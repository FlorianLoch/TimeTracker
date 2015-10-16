/**
 * AuthController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var log = require('captains-log')();

module.exports = {
	signup: function (req, res) {
		User.create(req.body).exec(function (err, user) {
			if (err) {
				log(err);
				return res.negotiate(err);
			}
			res.json(201, {
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName
			});
		});
	},
	login: function (req, res) {
		if (!req.body.email || !req.body.password) {
			res.badRequest();
			return;
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

				req.session.authenticated = valid;

				if (!valid) {
					return res.status(401).send();
				}

				req.session.me = ["email", "firstName", "lastName"].map(function (key) {
					return user[key];
				});

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
