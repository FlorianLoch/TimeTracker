var request = require('supertest');

describe('AuthController', function() {

  before(function (done) {
    User.destroy().exec(done);
  });

  before(function (done) {
    Workday.destroy().exec(done);
  });

  describe("signup()", function () {
    it("shall create a new user account", function (done) {
      request(sails.hooks.http.app)
        .post('/signup')
        .send({
          startTimestamp: Date.UTC(2015, 9, 18),
          email: "me@example.com",
          firstName: "Karl",
          lastName: "Napp",
          password: "1234"
        })
        .expect(201, done);
    });

    it("shall NOT create a new user account when information (lastName) is missing", function (done) {
      request(sails.hooks.http.app)
        .post('/signup')
        .send({
          startTimestamp: Date.UTC(2015, 9, 18),
          email: "me2@example.com",
          firstName: "Karl",
          password: "1234"
        })
        .expect(400)
        .expect(function (res) {
          if (res.body.error !== "E_VALIDATION") {
            return new Error();
          }
        })
        .end(done);
    });

    it("shall NOT create a new user account when information (startTimestamp) is missing", function (done) {
      request(sails.hooks.http.app)
        .post('/signup')
        .send({
          email: "me2@example.com",
          firstName: "Karl",
          lastName: "Napp",
          password: "1234"
        })
        .expect(400)
        .expect(function (res) {
          if (res.body.msg.indexOf("'startTimestamp' needs to be given.") !== 0) {
            return new Error();
          }
        })
        .end(done);
    });
  });

});
