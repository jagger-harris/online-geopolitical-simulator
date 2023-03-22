class Alliance {
  constructor(name, members) {
    this.name = name;
    this.members = members;
  }

  addCountry(country) {
    this.countries.push(country);
  }

  removeCountry(country) {
    this.countries = this.countries.filter((removedCountry) => {
      return removedCountry != country;
    })
  }
}
