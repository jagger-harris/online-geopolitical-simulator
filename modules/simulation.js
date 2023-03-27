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

    /* Update country data and update country AI*/
    this.countries.forEach(country => {
      country.updatePopulation();

      /**
        * Reasons countries declare war:
        * 1. Not democratic countries (democratic peace principle)
        * 2. Territorial peace theory
        * 3. Bordered countries tend to declare war
        * 4. Not allied to larger and more established countries
        * 5. Resources (to a certain extent, but mainly trade)
        * 6. Power parity (countries that are stronger tend to attack weaker foe)
        * 7. Ideological differences
        * 
        * Reasons countries do not declare war:
        * 1. Nuclear deterrence
        * 2. Capitalism and trade
        */

      if (country.democracyIndex() < 4) {
        this.countries.forEach(warCountry => {
          let warProbability = 0;

          if (warCountry.democracyIndex() < 4) {
            warProbability += 0.0000001;
          }

          if (warCountry.democracyIndex() > 4) {
            warProbability += 0.0000005;
          }

          if (warCountry.nuclearWeapons() > 0) {
            if (country.nuclearWeapons() < 1) {
              warProbability -= 0.00001;
            }
          }

          let inAlliance = false;

          this.alliances.forEach(alliance => {
            if (alliance.members.includes(warCountry.id)) {
              inAlliance = true;
            }
          });

          if (inAlliance) {
            warProbability -= 0.0000005;
          } else {
            warProbability += 0.0000001;
          }

          let random = Math.random();

          if (random <= warProbability) {
            let war = country.declareWar(warCountry);
            simulation.activeWars.push(war)
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
