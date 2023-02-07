class Node {
  constructor(population, happiness) {
    this.population = population;
    this.happiness = happiness;
    this.borderVertices = [];
  }

  stability() {
    return this.happiness;
  }

  addBorderVertex(vertex) {
    this.borderVertices.push(vertex);
  }
}
