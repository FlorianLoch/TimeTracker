var expect = require('chai').expect;
var dateHelper = require(__dirname + "/../../../api/services/DateHelper");

var testHelper = require(__dirname + "/../../testHelper");

describe("Workday-Model", function () {
  describe("#createWorkweek()", function () {
    before(function (done) {
      testHelper.createSampleUser(1, done);
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
});
