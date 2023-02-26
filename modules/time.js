const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Time object for simulation that contains the hour, day, month, and year
 */
class Time {
  constructor(day, month, year) {
    this.hour = 0;
    this.day = day;
    this.month = month;
    this.year = year;
  }

  toString() {
    let hourString = this.hour;
    
    if (this.hour < 10) {
      hourString = "0" + this.hour;
    }

    return this.day + " " + Months[this.month - 1] + ", " + this.year + ", " + hourString + ":00";
  }

  advance() {
    this.hour++

    if (this.hour > 23) {
      this.hour = 0;
      this.day++;
    }

    if (this.day > this.daysInMonth(this.year, this.month)) {
      this.day = 1;
      this.month++;
    }

    if (this.month > 12) {
      this.month = 1;
      this.year++;
    }
  }

  /* http://www.dispersiondesign.com/articles/time/number_of_days_in_a_month */
  daysInMonth(year, month) {
    let isLeapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);

    return (month === 2) ? (28 + isLeapYear) : 31 - (month - 1) % 7 % 2;
  }
}
