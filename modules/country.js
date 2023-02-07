class Country {
  constructor(name) {
    this.name = name;
    this.nodes = [];
  }

  addNode(node) {
    this.nodes.push(node);
  }
}
