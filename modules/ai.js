/**
 * AI object for simulation that allows countries to trade, declare war, etc.
 */
class AI {
  constructor(country) {
    this.country = country;
    this.alliances = [this.country];
    this.enemies = [];
  }

  updatePopulation() {
    for (let i = 0; i < this.country.nodes.length; i++) {
      let node = this.country.nodes[i];

      /* Grow population statistically */
      let averageWomenPopulation = Math.floor(node.population * 0.5);
      let percentageChance = (node.fertilityRate / (8766 * node.lifespan)) * averageWomenPopulation;
      let random = Math.random();

      if (random < percentageChance) {
        if (percentageChance < 1) {
          node.population += 1;
        }

        node.population += Math.round(percentageChance);
      }

      /* Decay population statistically */
      //let percentageChanceMaleDeath = (node.population / 2000) * (node.mortalityMaleAdults / 8766);
      let averageMaleDeaths = (node.mortalityMaleAdults / 2000) * (node.population * 0.5) / 8766;
      let averageFemaleDeaths = (node.mortalityFemaleAdults / 2000) * (node.population * 0.5) / 8766;
      random = Math.random();

      if (random < node.mortalityMaleAdults / 2000) {
        node.population -= Math.round(averageMaleDeaths);
      }

      random = Math.random();

      if (random < node.mortalityFemaleAdults / 2000) {
        node.population -= Math.round(averageFemaleDeaths);
      }
    }
  }

  declareWar(country) {
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

    let attackers = [this.country];
    let defenders = [country];

    return new War(attackers, defenders);
  }

  trade() {

  }
}

class Alliance {
  constructor(leader, countries) {
    this.leader = leader;
    this.countries = countries;
  }

  addCountry(country) {
    this.countries.push(country);
  }

  removeCountry(country) {
    let index = this.countries.indexOf(country);

    if (index !== -1) {
      this.countries.splice(index, 1);
    }
  }
}
