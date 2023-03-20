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

/* DELETE LATER */
let table;

class CountryClass {
  constructor(id, population, activeMilitary, reserveMilitary, fertilityRate, mortalityMaleAdults, mortalityFemaleAdults, mortalityInfants, lifespan, nuclearWeapons) {
    this.id = id;
    this.population = population;
    this.activeMilitary = activeMilitary;
    this.reserveMilitary = reserveMilitary;
    this.fertilityRate = fertilityRate;
    this.mortalityMaleAdults = mortalityMaleAdults;
    this.mortalityFemaleAdults = mortalityFemaleAdults;
    this.mortalityInfants = mortalityInfants;
    this.lifespan = lifespan;
    this.nuclearWeapons = nuclearWeapons;
  }
}

class SavedCountryClass {
  constructor(id, name, population, activeMilitary, reserveMilitary, fertilityRate, mortalityMaleAdults, mortalityFemaleAdults, mortalityInfants, lifespan, nuclearWeapons, vertices) {
    this.id = id;
    this.name = name;
    this.population = population;
    this.activeMilitary = activeMilitary;
    this.reserveMilitary = reserveMilitary;
    this.fertilityRate = fertilityRate;
    this.mortalityMaleAdults = mortalityMaleAdults;
    this.mortalityFemaleAdults = mortalityFemaleAdults;
    this.mortalityInfants = mortalityInfants;
    this.lifespan = lifespan;
    this.nuclearWeapons = nuclearWeapons;
    this.vertices = vertices;
  }
}


function preload() {
  countriesData = loadJSON("data/countries.json");
  landmassesData = loadJSON("data/landmasses.json");

  table = loadTable("data/countrydata.csv");

  loadFont("assets/Poppins-ExtraLight.ttf");
}

function setup() {
  /* DELETE LATER */
  let newCountriesData = [];

  //console.log(table.rows);

  for (let data of table.rows) {
    let dataId = data.arr[1];
    let dataPopulation = data.arr[2];
    let dataActiveMilitary = data.arr[3];
    let dataReserveMilitary = data.arr[4];
    let dataFertilityRate = data.arr[5];
    let dataMale = data.arr[6];
    let dataFemale = data.arr[7];
    let dataInfant = data.arr[8];
    let dataLifespan = data.arr[9];
    let dataNukes = data.arr[10];

    let newCountry = new CountryClass(dataId, dataPopulation, dataActiveMilitary, dataReserveMilitary, dataFertilityRate, dataMale, dataFemale, dataInfant, dataLifespan, dataNukes)
    
    for (let data of countriesData.countries) {
      if (data.id == newCountry.id) {
        newCountriesData.push(new SavedCountryClass(newCountry.id, data.name, newCountry.population, newCountry.activeMilitary, newCountry.reserveMilitary, newCountry.fertilityRate, newCountry.mortalityMaleAdults, newCountry.mortalityFemaleAdults, newCountry.mortalityInfants, newCountry.lifespan, newCountry.nuclearWeapons, data.vertices));
      }
    }
  }

  class Wow {
    constructor(countries) {
      this.countries = countries;
    }
  }

  let wow = new Wow(newCountriesData);

  //saveJSON(wow, "countries.json")
  
  createCanvas(windowWidth, windowHeight);

  simulation = new Simulation(1, 1, 2020);

  /* Create landmasses from data */
  for (let data of landmassesData.landmasses) {
    simulation.landmasses.push(new Landmass(data));
  }

  /* Create countries from data */
  for (let data of countriesData.countries) {
    simulation.countries.set(data.id, new Country(data));
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

    text(war.attackers[0].name + " vs. " + war.defenders[0].name + " | " + war.calculatePercentage(true) + ", " + war.calculatePercentage(false), width * 0.01, height * (0.45 + (i * 0.05)))
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
      //text("Node Reserve Milt: " + simulation.selectedNode.reserveMilitary, width * 0.75, height * 0.5);
      text("Node Male Mortality Rate: " + simulation.selectedNode.mortalityMaleAdults, width * 0.75, height * 0.5);
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
