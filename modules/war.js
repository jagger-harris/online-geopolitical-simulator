class War {
  constructor(attackers, defenders) {
    this.attackers = attackers;
    this.defenders = defenders;
    this.battles = [];
    this.over = false;
  }

  update() {
    if (!this.over) {
      if (this.calculatePercentage(false) > 60) {
        this.over = true;
        this.battles = [];

        return;
      }

      this.battles.push(this.newBattle());
      this.battles.forEach(battle => {
          if (battle) {
            battle.update();
          }
      })
    }
  }

  calculatePercentage(attackers) {
    if (attackers) {
      let totalPercentageOfAttackers;
      let totalAttackerNodeAmount = 0;
      let totalAttackCaptureNodes = 0;

      this.attackers.forEach(attacker => {
        totalAttackerNodeAmount += attacker.nodeAmount;
        attacker.nodes.forEach(node => {
          if (node.captured) {
            totalAttackCaptureNodes += 1;
          }
        })
      })
  
      totalPercentageOfAttackers = ((totalAttackCaptureNodes / totalAttackerNodeAmount) * 100).toFixed(2);

      return totalPercentageOfAttackers;
    } else {
      let totalPercentageOfDefenders;
      let totalDefenderNodeAmount = 0;
      let totalDefenderCaptureNodes = 0;

      this.defenders.forEach(defender => {
        totalDefenderNodeAmount += defender.nodeAmount;
        defender.nodes.forEach(node => {
          if (node.captured) {
            totalDefenderCaptureNodes += 1;
          }
        })
      })

      totalPercentageOfDefenders = ((totalDefenderCaptureNodes / totalDefenderNodeAmount) * 100).toFixed(2);

      return totalPercentageOfDefenders;
    }
  }

  newCountry(isAttacker, country) {
    isAttacker ? this.attackers.push(country) : this.defenders.push(country);
  }

  newBattle() {
    let attacker = this.attackers[Math.floor(Math.random() * this.attackers.length)];
    let defender = this.defenders[Math.floor(Math.random() * this.defenders.length)];
    let whoIsAttacking = Math.random() <= 0.6 ? "attacker" : "defender";
    let attackerNodesIncludingCaptured = attacker.nodes.concat(attacker.capturedNodes);
    let defenderNodesIncludingCaptured = defender.nodes.concat(defender.capturedNodes);
    let attackerNode = attackerNodesIncludingCaptured[Math.floor(Math.random() * attackerNodesIncludingCaptured.length)];
    let defenderNode = defenderNodesIncludingCaptured[Math.floor(Math.random() * defenderNodesIncludingCaptured.length)];
    let battle;
    let isCountryNode = false;
    
    if (whoIsAttacking == "attacker") {
      if (defenderNode.country == attacker) {
        isCountryNode = true;
      }

      battle = new Battle(attackerNode, defenderNode, isCountryNode);
    } else {
      if (attacker.country == defender) {
        isCountryNode = true;
      }

      battle = new Battle(defenderNode, attackerNode, isCountryNode);
    }

    return battle;
  }
}

class Battle {
  constructor(attackerNode, defenderNode, isCountryNode) {
    this.attackerNode = attackerNode;
    this.defenderNode = defenderNode;
    this.isCountryNode = isCountryNode;
    this.over = false;
  }

  update() {
    if (this.over) {
      return;
    }
    
    let militaryDeathUnits = Math.ceil(this.attackerNode.activeMilitary * 0.01);

    if (this.attackerNode.activeMilitary < 1) {
      this.over = true;

      return;
    }

    if (this.defenderNode.activeMilitary < 1) {
      this.over = true;
      this.defenderNode.activeMilitary = Math.floor(this.attackerNode.activeMilitary * 0.5);
      this.attackerNode.activeMilitary = Math.floor(this.attackerNode.activeMilitary * 0.5);
      this.attackerNode.country.capturedNodes.push(this.defenderNode);

      if (this.isCountryNode) {
        this.defenderNode.captured = false;
      } else {
        this.defenderNode.captured = true;
      }

      return;
    }

    this.defenderNode.activeMilitary -= militaryDeathUnits;
    this.attackerNode.activeMilitary -= militaryDeathUnits;
    this.defenderNode.population -= militaryDeathUnits;
    this.attackerNode.population -= militaryDeathUnits;
  }
}
