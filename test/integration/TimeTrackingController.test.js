var session = require('supertest-session');
var request = require("supertest");
var testHelper = require(__dirname + "/../testHelper");

describe('TimeTrackingController', function() {
  var testSession;
  var csrfToken;
  const CSRF_HEADER_NAME = "sails-csrf-token";

  before(function (done) {
    User.destroy().exec(done);
  });

  before(function (done) {
    Workday.destroy().exec(done);
  });

  //Register an user (this also creates an initial workweek)
  before(function (done) {
    request(sails.hooks.http.app)
      .post('/signup')
      .send({
        startTimestamp: Date.UTC(2015, 9, 18),
        email: "me@example.com",
        firstName: "Karl",
        lastName: "Napp",
        password: "1234"
      })
      .end(done);
  });

  before(function (done) {
    testSession = session(sails.hooks.http.app);

    testSession
      .post("/login")
      .send({
        email: "me@example.com",
        password: "1234"
      })
      .expect(200)
      .expect((res) => {
        //Expect a csrfToken as part of the return message
        if (res.body.csrfToken.length <= 0) return new Error("Missing csrfToken!");
      })
      .expect((res) => {
        //Store csrfToken in header to enable authentification for further requests made by this instance
        csrfToken = res.body.csrfToken;
      })
      .end(done);
  });

  describe("updateWorkday", function () {
    it("shall update an exisiting workday", function (done) {
      var day = Date.UTC(2015, 9, 16)
      testSession
        .put('/workday/' + day)
        .set(CSRF_HEADER_NAME, csrfToken)
        .send({
          workhours: 4,
          comment: "Oh, that was a looong day!"
        })
        .expect(function (res) {
          if (res.body.workhours !== 4) {
            return new Error();
          }
        })
        .expect(200, done);
    });

    it("shall fail updating a not existing workday", function (done) {
      var day = Date.UTC(2015, 9, 18)
      testSession
        .put('/workday/' + day)
        .set(CSRF_HEADER_NAME, csrfToken)
        .send({
          workhours: 4,
          comment: "Oh, that was a looong day!"
        })
        .expect(400, done);
    });
  });

});
