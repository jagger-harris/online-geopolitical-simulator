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
    this.alliances = [];
    this.time = new Time(day, month, year);
    this.activeWars = [];
  }

  update() {
    /* Advance clock */
    this.time.advance();

    /* Update country data */
    this.countries.forEach(country => country.updatePopulation());

    /* Handle wars */
    this.activeWars.forEach(war => {
      if (!war.pastWar) {
        war.update();
      }

      if (war.pastWar) {
        this.activeWars = this.activeWars.filter((currentWar) => {
          return currentWar != war;
        })
      }
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
