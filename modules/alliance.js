/**
 * @class Alliance representing a relationship between two countries.
 * 
 * Used to determine wars and peace deals.
 */
class Alliance {
  /**
   * Creates an instance of an alliance.
   * 
   * @param {string} name Name of the alliance.
   * @param {Array.<string>} members Members of the alliance based on ID of a country.
   */
  constructor(name, members) {
    this.name = name;
    this.members = members;
  }

  /**
   * Add a country from an alliance.
   * 
   * @param {Country} country Country to add.
   */
  addCountry(country) {
    this.members.push(country.id);
  }

  /**
   * Remove a country from an alliance.
   * 
   * @param {Country} country Country to remove.
   */
  removeCountry(country) {
    this.members = this.members.filter((removedCountry) => {
      return removedCountry.id != country.id;
    })
  }
}
