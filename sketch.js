/**
 * Raw JSON data
 */
let countriesData;
let landmassesData;

/**
 * Timing
 */
let currentTime;
let previousTime;

/**
 * Simulation data
 */
let simulation;

/**
 * Mouse and zoom
 */
let zoom = 1;
let offset;

/* Other */

function preload() {
  countriesData = loadJSON("data/countries.json");
  landmassesData = loadJSON("data/landmasses.json");

  loadFont("assets/Poppins-ExtraLight.ttf")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  simulation = new Simulation(1, 1, 2020);

  /* Create landmasses from data */
  for (let data of landmassesData.landmasses) {
    simulation.landmasses.push(new Landmass(data));
  }

  /* Create countries from data */
  for (let data of countriesData.countries) {
    simulation.countries.set(data.id, new Country(data));
    //simulation.countries.push(new Country(data));
  }

  /* Create nodes for all countries */
  let totalNodeAmount = 10000;
  let nodeAmount = [];
  let countryAreas = [];
  
  for (let [key, value] of simulation.countries) {
    let triangleAreas = Country.getAreas(value.countryTriangles());
    let totalArea = 0;

    triangleAreas.forEach(ratio => {
      totalArea += ratio;
    })

    countryAreas.push(totalArea);
  }

  let areaRatios = Country.getAreaRatios(countryAreas);

  for (let ratio of areaRatios) {
    nodeAmount.push(Math.ceil(totalNodeAmount * ratio));
  }

  let counter = 0;
  for (let [key, value] of simulation.countries) {
    value.nodes = value.generateNodes(countriesData.countries[counter], nodeAmount[counter]);
    value.nodeAmount = nodeAmount[counter];
    counter += 1;
  }

  /**
   * 
   * Declare war for testing *DELETE LATER*
   * 
   **/
  let war = simulation.countries.get("USA").ai.declareWar(simulation.countries.get("CAN"));
  simulation.activeWars.push(war);
  simulation.activeWars[0].battles.push(new Battle(simulation.countries.get("USA").nodes[0], simulation.countries.get("CAN").nodes[0]))
  //simulation.activeWars[0].newCountry(true, simulation.countries.get("CAN"));

  /* Mouse transformations setup */
  offset = createVector(0, 0);
  window.addEventListener("wheel", event => {
    const minZoom = 1;
    const zoomCalc = 1 - (event.deltaY / 1000);
    const mouse = createVector(mouseX, mouseY);

    zoom *= zoomCalc;

    if (zoom < minZoom) {
      zoom = minZoom;
      return;
    }
    
    offset.sub(mouse).mult(zoomCalc).add(mouse);
  });
}

function draw() {
  background(0, 0, 60);
  textFont("Poppins-ExtraLight");
  stroke(255);
  strokeWeight(2 / zoom);

  /* Run simulation */
  currentTime = millis();

  if (Math.floor(currentTime / simulation.speed) != Math.floor(previousTime / simulation.speed)) {
    simulation.update();
  }

  previousTime = currentTime;

  /* Mouse transformations */
  translate(offset.x, offset.y);
  scale(zoom);

  if (mouseIsPressed) {
    offset.x -= pmouseX - mouseX;
    offset.y -= pmouseY - mouseY;
  }

  /* Draw landmasses and countries */
  simulation.landmasses.forEach(landmass => landmass.draw());
  simulation.countries.forEach(country => country.draw());

  /* Draw GUI */
  drawGui();
}

function mouseReleased() {
  for (let [key, value] of simulation.countries) {
    value.selected = value.mouseInsideCountry();

    if (value.selected) {
      simulation.selectedCountry = value;

      for (let node of value.nodes) {
        node.selected = node.mouseInsideNode();

        if (node.selected) {
          simulation.selectedNode = node;
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawGui() {
  /* Reset Matrix for GUI */
  resetMatrix();

  strokeWeight(2);
  fill(255);
  textSize(20);
  textAlign(LEFT);
  text("FPS: " + frameRate().toFixed(0), 20, height * 0.02);
  text("Online Geopolitical Simulator - Jagger Harris 2023 - ALPHA", 20, height * 0.97);
  textAlign(CENTER, CENTER);
  textSize(40);
  text(simulation.time.toString(), width * 0.5, height * 0.05);
  textAlign(LEFT);
  textSize(30);
  
  text("Wars: ", width * 0.01, height * 0.4);
  
  for (let i = 0; i < simulation.activeWars.length; i++) {
    let war = simulation.activeWars[i];

    text(war.attackers[0].name + " vs. " + war.defenders[0].name, width * 0.01, height * (0.45 + (i * 0.05)))
  }

  if (simulation.selectedCountry) {
    text("Country: " + simulation.selectedCountry.name, width * 0.75, height * 0.15);
    text("Population: " + simulation.selectedCountry.population(), width * 0.75, height * 0.2);
    text("Fertility Rate: " + simulation.selectedCountry.fertilityRate(), width * 0.75, height * 0.25);
    text("Lifespan: " + simulation.selectedCountry.lifespan(), width * 0.75, height * 0.3);

    if (simulation.selectedNode) {
      text("Node Population: " + simulation.selectedNode.population, width * 0.75, height * 0.4);
      text("Node Active Milt: " + simulation.selectedNode.activeMilitary, width * 0.75, height * 0.45);
      //text("Node Fertility Rate: " + simulation.selectedNode.fertilityRate, width * 0.75, height * 0.45);
      text("Node Reserve Milt: " + simulation.selectedNode.militaryReserves, width * 0.75, height * 0.5);
      //text("Node Mortality Rate: " + simulation.selectedNode.mortalityRate, width * 0.75, height * 0.5);
    }
  } else {
    text("Country: None", width * 0.75, windowHeight * 0.15);
  }

  let buttons = [];

  for (let i = 0; i < 5; i++) {
    buttons.push(new Button(width * 0.5 + (i * 80) - 180, height * 0.09, 50, 50, i + 1, 40));
  }

  for (let i = 0; i < 5; i++) {
    buttons[i].draw(() => {
      if (i == 4) {
        simulation.speed = 1;
      }

      if (i == 3) {
        simulation.speed = 50;
      }

      if (i == 2) {
        simulation.speed = 100;
      }

      if (i == 1) {
        simulation.speed = 250;
      }

      if (i == 0) {
        simulation.speed = 500;
      }
    });
  }
}
