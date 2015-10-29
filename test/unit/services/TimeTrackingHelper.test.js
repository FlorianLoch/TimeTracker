var expect = require('chai').expect;

var testHelper = require(__dirname + "/../../testHelper");

describe("TimeTrackingHelper", function () {
    // before(function (done) {
    //   User.destroy().exec(done);
    // });

  before(function (done) {
    testHelper.createSampleUser(1, done);
  });

  describe("getWorkweekWithMetadata()", function () {
    var time = Date.UTC(2015, 9, 19);

    before(function (done) {
      Workday.destroy().exec(done);
    });

    before(function (done) {
      Workday.createWorkweek(1, time, done);
    });

    //CAUTION: The following testcates depend on each other. The stepwise test
    //the behaviour of getWorkweekWithMetadata() by starting with a lone
    //workweek and than add one further week two times. By this the detection
    //of existing adjacent workweeks shall be tested.
    it("shall find a workweek without adjacent weeks", function (done) {
      TimeTrackingHelper.getWorkweekWithMetadata(1, time, function (err, workdays, beginOfPrevWeek, beginOfNextWeek) {
        expect(err).to.be.null;
        expect(workdays.length).to.be.equal(5);
        expect(beginOfPrevWeek).to.be.null;
        expect(beginOfNextWeek).to.be.null;
        done();
      });
    });

    it("shall find a workweek with an adjacent, previous week", function (done) {
      Workday.createWorkweek(1, DateHelper.getDayInNextWeek(time), function (err) {
        expect(err).to.be.null;
        TimeTrackingHelper.getWorkweekWithMetadata(1, Date.UTC(2015, 9, 26), function (err, workdays, beginOfPrevWeek, beginOfNextWeek) {
          expect(err).to.be.null;
          expect(workdays.length).to.be.equal(5);
          expect(beginOfPrevWeek).to.be.equal(time);
          expect(beginOfNextWeek).to.be.null;
          done();
        });
      });
    });

    it("shall find a workweek with two adjacent (previous and subsequent) weeks", function (done) {
      Workday.createWorkweek(1, Date.UTC(2015, 10, 2), function (err) {
        expect(err).to.be.null;
        TimeTrackingHelper.getWorkweekWithMetadata(1, Date.UTC(2015, 9, 26), function (err, workdays, beginOfPrevWeek, beginOfNextWeek) {
          expect(err).to.be.null;
          expect(workdays.length).to.be.equal(5);
          expect(beginOfPrevWeek).to.be.equal(time);
          expect(beginOfNextWeek).to.be.equal(Date.UTC(2015, 10, 2));
          done();
        });
      });
    });
  });

  describe("sumUpWorktime()", function () {
    before(function (done) {
      Workday.destroy().exec(done);
    });

    before(function (done) {
      Workday.createWorkweek(1, Date.UTC(2015, 9, 28), done, 5);
    });

    it("shall sum up the complete week", function (done) {
      TimeTrackingHelper.sumUpWorktime(1, null, function (err, sum) {
        expect(err).to.be.null;
        expect(sum).to.be.equal(5);
        done();
      });
    });

    it("shall sum up only some days of the week", function (done) {
      TimeTrackingHelper.sumUpWorktime(1, Date.UTC(2015, 9, 28), function (err, sum) {
        expect(err).to.be.null;
        expect(sum).to.be.equal(3);
        done();
      });
    });
  });
});
