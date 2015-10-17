var expect = require('chai').expect;
var dateHelper = require(__dirname + "/../../../api/services/DateHelper");

var testHelper = require(__dirname + "/../../testHelper");

describe("Workday-Model", function () {
  before(function (done) {
    testHelper.createSampleUser(1, done);
  });

  describe("#createWorkweek()", function () {
    beforeEach(function (done) {
        Workday.destroy().exec(done);
    });

    it("after invoking 5 entries should be created in database", function (done) {
      //The check whether the computed timestamps are correct are done in unit test for DateHelper
      Workday.createWorkweek(1, Date.now(), function (err) {
        expect(err).to.be.null;

        Workday.count().exec(function (err, count) {
          expect(count).to.be.equal(5);
          done();
        });
      });
    });
  });

  describe("#getMostRecentWeekday", function () {
    before(function (done) {
      Workday.destroy().exec(done);
    });

    before(function (done) {
      Workday.create([{
        day: Date.UTC(2015, 9, 16),
        userId: 1,
        workhours: 4
      }, {
        day: Date.UTC(2015, 9, 17),
        userId: 1,
        workhours: 4
      }, {
        day: Date.UTC(2015, 9, 15),
        userId: 1,
        workhours: 4
      }]).exec(done);
    });

    it("shall return the most recent workday", function (done) {
      Workday.getMostRecentWorkday(1, function (err, workday) {
        expect(workday.day).to.be.equal(Date.UTC(2015, 9, 17));
        done();
      });
    });
  });
});
