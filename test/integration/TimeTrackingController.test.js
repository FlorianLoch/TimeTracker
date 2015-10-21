var session = require('supertest-session');
var testHelper = require(__dirname + "/../testHelper");

describe('TimeTrackingController', function() {
  var testSession;

  before(function (done) {
    User.destroy().exec(done);
  });

  before(function (done) {
    Workday.destroy().exec(done);
  });

  //Register an user (this also creates an initial workweek)
  before(function (done) {
    testSession = session(sails.hooks.http.app);

    testSession
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

  describe("updateWorkday", function () {
    it("shall update an exisiting workday", function (done) {
      var day = Date.UTC(2015, 9, 16)
      testSession
        .post('/workday/' + day)
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
        .post('/workday/' + day)
        .send({
          workhours: 4,
          comment: "Oh, that was a looong day!"
        })
        .expect(400, done);
    });
  });

});
