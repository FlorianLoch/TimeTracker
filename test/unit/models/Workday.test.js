var expect = require('chai').expect;
var dateHelper = require(__dirname + "/../../../api/services/DateHelper");

var testHelper = require(__dirname + "/../../testHelper");

describe("Workday-Model", function () {
  before(function (done) {
    testHelper.createSampleUser(1, done);
  });

  describe("createWorkweek()", function () {
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

  describe("getMostRecentWeekday", function () {
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

  describe("getWorkweek()", function () {
    beforeEach(function (done) {
      Workday.destroy().exec(done);
    });

    it("shall find the created workweek", function (done) {
      var time = Date.UTC(2015, 9, 18);

      Workday.createWorkweek(1, time, function () {
        Workday.getWorkweek(1, time, function (err, workdays) {
          expect(err).to.be.null;
          expect(workdays.length).to.be.equal(5);
          expect(workdays[0].day).to.be.equal(Date.UTC(2015, 9, 12));
          done();
        });
      });
    });

    it("shall NOT find a not created workweek", function (done) {
      var time = Date.UTC(2015, 9, 18);

      Workday.getWorkweek(1, time, function (err, workdays) {
        expect(err.message).to.be.equal("Workweek does not exist for this user!");
        expect(workdays.length).to.be.equal(0);
        done();
      });
    });
  });
});
