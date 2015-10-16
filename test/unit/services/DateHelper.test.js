var expect = require('chai').expect;
var dateHelper = require(__dirname + "/../../../api/services/DateHelper");

describe("DateHelper.js", function () {

  describe("automatically as global variables loaded service instance", function () {
    it("shall be unequal", function () {
      expect(dateHelper).to.be.defined;
      expect(DateHelper).to.be.defined;
      expect(DateHelper !== dateHelper).to.be.true;
    });
  });

  describe("#beginOfDay()", function () {
    it("Begin of 17.12.1995 shall be 819158400000", function () {
      var utcDate = new Date(Date.UTC(95, 11, 17, 13, 14, 15));
      expect(utcDate.getUTCHours()).to.be.equal(13);
      expect(utcDate.getUTCMonth()).to.be.equal(11); //December

      var beginOfDay = dateHelper.beginOfDay(utcDate);

      var expectedTime = Date.UTC(95, 11, 17, 0, 0, 0);
      expect(expectedTime).to.be.equal(819158400000);
      expect(beginOfDay).to.be.equal(expectedTime);
    });
  });

  describe("#weekdaysInWeek(): shall give the workdays in the current week", function () {
    it("By a sunday given", function () {
      var date = new Date(Date.UTC(2015, 10, 1, 14, 50));
      var weekdays = dateHelper.weekdaysInWeek(date);

      expect(weekdays.length).to.be.equal(5);
      expect(weekdays[0]).to.be.equal(new Date(Date.UTC(2015, 9, 26)).valueOf());
      expect(weekdays[4]).to.be.equal(new Date(Date.UTC(2015, 9, 30)).valueOf());
    });

    it("By a monday morning given", function () {
      var date = new Date(Date.UTC(2015, 9, 12));
      var weekdays = dateHelper.weekdaysInWeek(date);

      expect(weekdays.length).to.be.equal(5);
      expect(weekdays[0]).to.be.equal(new Date(Date.UTC(2015, 9, 12, 0, 0)).valueOf());
      expect(weekdays[4]).to.be.equal(new Date(Date.UTC(2015, 9, 16)).valueOf());
    });

    it("By a wednesday in a leapyear given", function () {
      var date = new Date(Date.UTC(2016, 2, 2, 13, 37));
      var weekdays = dateHelper.weekdaysInWeek(date);

      expect(weekdays.length).to.be.equal(5);
      expect(weekdays[0]).to.be.equal(new Date(Date.UTC(2016, 1, 29, 0, 0)).valueOf());
      expect(weekdays[1]).to.be.equal(new Date(Date.UTC(2016, 2, 1, 0, 0)).valueOf());
      expect(weekdays[2]).to.be.equal(new Date(Date.UTC(2016, 2, 2, 0, 0)).valueOf());
      expect(weekdays[3]).to.be.equal(new Date(Date.UTC(2016, 2, 3, 0, 0)).valueOf());
      expect(weekdays[4]).to.be.equal(new Date(Date.UTC(2016, 2, 4, 0, 0)).valueOf());
    });
  });

});
