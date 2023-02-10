class Country {
  constructor(name) {
    this.name = name;
    this.totalPopulation;
    this.averageHappiness;
    this.nodes = [];
  }

  addNode(node) {
    this.nodes.push(node);
  }

  totalPopulation() {
    let totalPopulation;
    
    for (let data in this.nodes) {
      totalPopulation += data.population;
    }

    return totalPopulation;
  }

  averageHappiness() {
    let averageHappiness;
    
    for (let data in this.nodes) {
      averageHappiness += data.happiness;
    }

    averageHappiness = averageHappiness / this.nodes.length;

    return averageHappiness;
  }
}
