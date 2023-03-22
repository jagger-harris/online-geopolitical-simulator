/**
 * Main simulation object that controls the entire simulation
 */
class Simulation {
  constructor(day, month, year) {
    this.selectedCountry;
    this.selectedNode;
    this.speed = 500;
    this.landmasses = [];
    this.countries = new Map();
    this.time = new Time(day, month, year);
    this.activeWars = [];
    this.pastWars = [];
  }

  update() {
    /* Advance clock */
    this.time.advance();

    /* Update country data */
    for (let [key, value] of this.countries) {
      value.ai.updatePopulation();
    }

    /* Handle wars */
    this.activeWars.forEach(war => {
      war.update();
    })
  }

  changeSpeed(speed) {
    if (speed == 0) {
      this.speed = 0;
    }

    if (speed == 1) {
      this.speed = 200;
    }

    if (speed == 2) {
      this.speed = 100;
    }

    if (speed == 3) {
      this.speed = 1;
    }
  }
}
