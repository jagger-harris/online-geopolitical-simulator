const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * @class Time representing simulation time.
 * 
 * Used for the simulation clock at the top of the program.
 */
class Time {
  /**
   * Creates an instance of time for a simulation.
   * 
   * @param {number} day Starting day.
   * @param {number} month Starting month.
   * @param {number} year Starting year.
   */
  constructor(day, month, year) {
    this.hour = 0;
    this.day = day;
    this.month = month;
    this.year = year;
  }

  /**
   * Converts time to readable string.
   * 
   * @returns Readable string for time.
   */
  toString() {
    let hourString = this.hour;
    
    if (this.hour < 10) {
      hourString = "0" + this.hour;
    }

    return this.day + " " + Months[this.month - 1] + ", " + this.year + ", " + hourString + ":00";
  }

  /**
   * Advances the time.
   */
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

  /**
   * Gets the days in a month.
   * Credits: http://www.dispersiondesign.com/articles/time/number_of_days_in_a_month
   * 
   * @param {number} year The year of the month.
   * @param {number} month The month.
   * @returns Days of the given month in a given year.
   */
  daysInMonth(year, month) {
    let isLeapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);

    return (month === 2) ? (28 + isLeapYear) : 31 - (month - 1) % 7 % 2;
  }
}
