/**
 * Main simulation object that controls the entire simulation
 */
class Simulation {
  constructor(day, month, year) {
    this.selectedCountry;
    this.selectedNode;
    this.speed = 500;
    this.landmasses = [];
    this.countries = [];
    this.time = new Time(day, month, year);
    this.activeWars = [];
    this.pastWars = [];
  }

  update() {
    /* Advance clock */
    this.time.advance();

    /* Update country data */
    for (let country of this.countries) {
      country.ai.updatePopulation();
    }

    /* Handle wars */
    for (let war of this.activeWars) {
      
    }
  }
}
