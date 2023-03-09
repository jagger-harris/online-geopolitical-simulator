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
      percentageChance = (node.population / 1000) * (node.mortalityRate / 8766);
      random = Math.random();

      if (random < percentageChance) {
        node.population -= Math.round(percentageChance);
      }
    }
  }

  declarePeace() {

  }

  declareWar(country) {
    let attackers = [this.country];
    let defenders = [country];

    return new War(attackers, defenders);
  }

  trade() {

  }
}

class Battle {
  constructor(attackerNode, defenderNode) {
    
  }
}

class War {
  constructor(attackers, defenders) {
    this.attackers = attackers;
    this.defenders = defenders;
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