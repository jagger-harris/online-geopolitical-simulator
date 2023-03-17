class War {
  constructor(attackers, defenders) {
    this.attackers = attackers;
    this.defenders = defenders;
    this.battles = [];
  }

  newCountry(isAttacker, country) {
    isAttacker ? this.attackers.push(country) : this.defenders.push(country);
  }
}

class Battle {
  constructor(attackerNode, defenderNode) {
    this.attackerNode = attackerNode;
    this.defenderNode = defenderNode;
    this.over = false;
  }

  update() {
    if (this.over) {
      return;
    }
    
    let ratio = Math.floor(this.attackerNode.activeMilitary * 0.005);

    if (this.defenderNode.activeMilitary < 1) {
      this.over = true;
      this.defenderNode.activeMilitary = this.attackerNode.activeMilitary;
      this.attackerNode.activeMilitary = 0;
      this.attackerNode.country.capturedNodes.push(this.defenderNode);
      this.defenderNode.captured = true;
    }

    if (this.attackerNode.activeMilitary > 0) {
      this.defenderNode.activeMilitary -= ratio;
      this.attackerNode.activeMilitary -= ratio;
      this.defenderNode.population -= ratio;
      this.attackerNode.population -= ratio;
    } else {
      this.over = true;
    }
  }
}
