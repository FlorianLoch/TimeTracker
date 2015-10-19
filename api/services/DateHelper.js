const DAY_MS = 36E2 * 1E3 * 24;

module.exports = {
  //xDaysAgo: xDaysAgo,
  weekdaysInWeek: weekdaysInWeek,
  beginOfDay: beginOfDay,
  getDayInNextWeek: getDayInNextWeek,
  DAY_MS: DAY_MS
};

// function xDaysAgo(xDays, time) {
//   time = time || Date.now();
//
//   xDays = xDays * DAY_MS;
//
//   return time - xDays;
// }

function beginOfDay(time) {
  time = time || Date.now();

  if (time instanceof Date) time = time.valueOf();

  date = new Date(time);
  return time - 36E5 * date.getUTCHours() - 6E4 * date.getUTCMinutes() - 1E3 * date.getUTCSeconds() - date.getUTCMilliseconds();
}

function weekdaysInWeek(time) {
  time = time || Date.now();

  if (time instanceof Date) {
    time = time.valueOf();
  }

  time = beginOfDay(time);

  date = new Date(time);

  weekday = date.getUTCDay();

  if (weekday === 0) {
    weekday = 7; //One day is substracted afterwards, than the weekday shall have value of 6
  }

  firstDay = time - (weekday - 1) * DAY_MS;

  var daysInWeek = [0, 1, 2, 3, 4].map(function (i) {
    return firstDay + i * DAY_MS;
  });

  return daysInWeek;
}

function getDayInNextWeek(time) {
  return time + 7 * DAY_MS;
}
