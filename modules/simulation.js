/**
 * @class Simulation representing the basis for the entire sim.
 * 
 * Used to store all simulation data and run the simulation.
 */
class Simulation {
  /**
   * Creates an instance of a simulation.
   * 
   * @param {number} day Starting day.
   * @param {number} month Starting month.
   * @param {number} year Starting year.
   */
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

  /**
   * Update the simulations time, wars, etc.
   */
  update() {
    /* Advance clock */
    this.time.advance();

    /* Update country data and update country AI*/
    this.countries.forEach(country => {
      country.update();

      if (country.democracyIndex < 4) {
        this.countries.forEach(warCountry => {
          let warProbability = 0;

          if (country == warCountry) {
            return;
          }

          if (warCountry.democracyIndex < 4) {
            warProbability += 0.0000001;
          }

          if (warCountry.democracyIndex > 4) {
            warProbability += 0.00000005;
          }

          if (warCountry.nuclearWeapons > 0) {
            if (country.nuclearWeapons < 1) {
              warProbability -= 0.0000002;
            }
          }

          if (country.gdp > warCountry.gdp) {
            warProbability += 0.0000001;
          }

          let inAlliance = false;

          this.alliances.forEach(alliance => {
            if (alliance.members.includes(warCountry.id)) {
              inAlliance = true;
            }
          });

          if (inAlliance) {
            warProbability -= 0.00000005;
          } else {
            warProbability += 0.0000001;
          }

          let random = Math.random();

          if (random <= warProbability) {
            simulation.activeWars.forEach(war => {
              if (!war.attackers.includes(country) && !war.attackers.includes(warCountry)) {
                return;
              }

              if (!war.defenders.includes(country) && !war.defenders.includes(warCountry)) {
                return;
              }

              if (war.attackers.includes(country) && war.defenders.includes(warCountry)) {
                return;
              }

              if (war.attackers.includes(warCountry) && war.defenders.includes(country)) {
                return;
              }
            });

            let war = country.declareWar(warCountry);
            simulation.activeWars.push(war);
          }
        });
      }
    });

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
    });
  }

  /**
   * Update simulation speed.
   * 
   * @param {number} speed Speed of simulation (only 0, 1, 2, or 3).
   */
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
