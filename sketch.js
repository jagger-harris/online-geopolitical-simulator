/**
 * Raw JSON data
 */
let countriesData;
let alliancesData;

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

/**
 * Menu and GUI system
 */
let clockButton;
let menuButtons = [];
let showCountryMenu = false;
let showNodeMenu = false;
let showWarMenu = false;

function preload() {
  countriesData = loadJSON("data/countries.json");
  alliancesData = loadJSON("data/alliances.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  simulation = new Simulation(1, 1, 2021);

  /* Create clock button */
  clockButton = createButton("");
  setDefaultButtonLooks(clockButton);
  clockButton.size(320, 50);
  clockButton.position(width * 0.42, height * 0.02);

  /* Create speed buttons */
  let speedButtons = [];

  for (let i = 0; i < 4; i++) {
    let button = createButton("");
    
    setDefaultButtonLooks(button);
    button.position(width * 0.963 + (i * width * 0.035) - (width * 0.1), height * 0.02);
    button.mouseClicked(() => {
      simulation.changeSpeed(i);
      button.style("background-color", "rgb(150, 150, 150)");
    });
    
    speedButtons.push(button);
  }

  speedButtons[0].html("||");
  speedButtons[1].html("1");
  speedButtons[2].html("2");
  speedButtons[3].html("3");

  /* Create menu buttons */
  let menuButtonAmount = 3;

  for (let i = 0; i <= menuButtonAmount; i++) {
    let button = createButton("");

    if (i != 0) {
      button.hidden = true;
      button.hide();
    }

    setDefaultButtonLooks(button);
    button.position(width * 0.01, height * (0.02 + (i * 0.07)));

    menuButtons.push(button);
  }

  let menuButton = menuButtons[0];
  menuButton.html("≡");
  menuButton.mouseClicked(() => {
    for (let i = 0; i < menuButtons.length; i++) {
      let button = menuButtons[i];

      if (i != 0) {
        if (button.hidden) {
          button.hidden = false;
          button.show();
        } else {
          button.hidden = true;
          showCountryMenu = false;
          showNodeMenu = false;
          showWarMenu = false;
          button.hide();
        }
      }
    }

    menuButton.style("background-color", "rgb(150, 150, 150)");
  });
  
  let countryMenuButton = menuButtons[1];
  countryMenuButton.html("🏳️");
  countryMenuButton.mouseClicked(() => {
    showCountryMenu = !showCountryMenu;
    showNodeMenu = false;
    showWarMenu = false;
    countryMenuButton.style("background-color", "rgb(150, 150, 150)");
  });

  let nodeMenuButton = menuButtons[2];
  nodeMenuButton.html("🔘");
  nodeMenuButton.mouseClicked(() => {
    showNodeMenu = !showNodeMenu;
    showCountryMenu = false;
    showWarMenu = false;
    nodeMenuButton.style("background-color", "rgb(150, 150, 150)");
  });

  let warMenuButton = menuButtons[3];
  warMenuButton.html("⚔️");
  warMenuButton.mouseClicked(() => {
    showWarMenu = !showWarMenu;
    showCountryMenu = false;
    showNodeMenu = false;
    warMenuButton.style("background-color", "rgb(150, 150, 150)");
  });

  /* Create countries from data */
  countriesData.countries.forEach(country => simulation.countries.set(country.id, new Country(country)));

  /* Create alliances from data */
  alliancesData.alliances.forEach(alliance => simulation.alliances.push(new Alliance(alliance.name, alliance.members)));

  /* Create nodes for all countries */
  let totalNodeAmount = 10000;
  let nodeAmount = [];
  let countryAreas = [];
  
  simulation.countries.forEach(country => {
    let triangleAreas = Country.getAreas(country.countryTriangles());
    let totalArea = 0;

    triangleAreas.forEach(ratio => {
      totalArea += ratio;
    })

    countryAreas.push(totalArea);
  });

  let areaRatios = Country.getAreaRatios(countryAreas);

  areaRatios.forEach(ratio => nodeAmount.push(Math.ceil(totalNodeAmount * ratio)));

  let counter = 0;
  simulation.countries.forEach(country => {
    country.nodes = country.generateNodes(countriesData.countries[counter], nodeAmount[counter]);
    country.nodeAmount = nodeAmount[counter];
    counter += 1;
  })

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
  background(0, 0, 50);
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

  /* Draw countries */
  simulation.countries.forEach(country => country.draw());

  /* Draw and update GUI */
  clockButton.html(simulation.time.toString());
  drawGui();
}

function mouseReleased() {
  simulation.countries.forEach(country => {
    country.selected = country.mouseInsideCountry();

    if (country.selected) {
      simulation.selectedCountry = country;

      for (let node of country.nodes) {
        node.selected = node.mouseInsideNode();

        if (node.selected) {
          simulation.selectedNode = node;
        }
      }
    }
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setDefaultButtonLooks(button) {
  button.size(50, 50);
  button.style("font-size", "2em");
  button.style("border", "2px solid white");
  button.style("background-color", "black");
  button.style("color", "white");
  button.mouseOver(() => {
    button.style("background-color", "rgb(100, 100, 100)");
  });
  button.mouseOut(() => {
    button.style("background-color", "black");
  })
}

function drawGui() {
  /* Reset Matrix for GUI */
  resetMatrix();

  noStroke();
  fill(255);
  textSize(20);
  textAlign(LEFT);
  text("Online Geopolitical Simulator - Jagger Harris 2023", 20, height * 0.97);
  textAlign(LEFT, CENTER);
  textSize(30);

  /* Menus */
  drawCountryMenu();
  drawNodeMenu();
  drawWarMenu();
}

function drawCountryMenu() {
  if (showCountryMenu) {
    stroke(255);
    strokeWeight(2);
    fill(0);
    rect(width * 0.044, height * 0.092, 325, 420);
    noStroke();
    fill(255);
    textSize(22);
    textAlign(LEFT);
    text("Country Menu", width * 0.048, height * 0.12);

    if (simulation.selectedCountry) {
      text(simulation.selectedCountry.name, width * 0.048, height * 0.16);
      text("Population: " + simulation.selectedCountry.population.toLocaleString(), width * 0.048, height * 0.19);
      text("Active Military: " + simulation.selectedCountry.activeMilitary.toLocaleString(), width * 0.048, height * 0.22);
      text("Reserve Military: " + simulation.selectedCountry.reserveMilitary.toLocaleString(), width * 0.048, height * 0.25);
      text("Fertility Rate: " + simulation.selectedCountry.fertilityRate.toFixed(2), width * 0.048, height * 0.28);
      text("Adult Mortality Rate (M): " + simulation.selectedCountry.mortalityMaleAdults.toFixed(2), width * 0.048, height * 0.31);
      text("Adult Mortality Rate (F): " + simulation.selectedCountry.mortalityFemaleAdults.toFixed(2), width * 0.048, height * 0.34);
      text("Lifespan: " + simulation.selectedCountry.lifespan.toFixed(2), width * 0.048, height * 0.37);
      text("Democracy Index: " + simulation.selectedCountry.democracyIndex.toFixed(2), width * 0.048, height * 0.4);
      text("GDP: $" + Number(simulation.selectedCountry.gdp.toFixed(2)).toLocaleString(), width * 0.048, height * 0.43);
      text("Nuclear Weapons: " + simulation.selectedCountry.nuclearWeapons, width * 0.048, height * 0.46);
    } else {
      text("No Selected Country", width * 0.048, height * 0.16);
    }
  }
}

function drawNodeMenu() {
  if (showNodeMenu) {
    stroke(255);
    strokeWeight(2);
    fill(0);
    rect(width * 0.044, height * 0.162, 325, 420);
    noStroke();
    fill(255);
    textSize(22);
    textAlign(LEFT);

    text("Node Menu", width * 0.048, height * 0.19);

    if (simulation.selectedCountry) {
      if (simulation.selectedNode) {
        text("Country: " + simulation.selectedNode.country.name, width * 0.048, height * 0.23);
        text("Population: " + simulation.selectedNode.population.toLocaleString(), width * 0.048, height * 0.26);
        text("Active Military: " + simulation.selectedNode.activeMilitary.toLocaleString(), width * 0.048, height * 0.29);
        text("Reserve Military: " + simulation.selectedNode.reserveMilitary.toLocaleString(), width * 0.048, height * 0.32);
        text("Fertility Rate: " + simulation.selectedNode.fertilityRate, width * 0.048, height * 0.35);
        text("Adult Mortality Rate (M): " + simulation.selectedNode.mortalityMaleAdults, width * 0.048, height * 0.38);
        text("Adult Mortality Rate (F): " + simulation.selectedNode.mortalityFemaleAdults, width * 0.048, height * 0.41);
        text("Lifespan: " + simulation.selectedNode.lifespan, width * 0.048, height * 0.44);
        text("Democracy Index: " + simulation.selectedNode.democracyIndex, width * 0.048, height * 0.47);
        text("GDP: $" + simulation.selectedNode.gdp.toLocaleString(), width * 0.048, height * 0.5);
        text("Nuclear Weapons: " + simulation.selectedNode.nuclearWeapons, width * 0.048, height * 0.53);
        
        if (simulation.selectedNode.capturer != simulation.selectedNode.country) {
          text("Capturer: " + simulation.selectedNode.capturer.name, width * 0.048, height * 0.56);
        }
      } else {
        text("No Selected Node", width * 0.048, height * 0.23);
      }
    } else {
      text("No Selected Country", width * 0.048, height * 0.23);
    }
  }
}

function drawWarMenu() {
  if (showWarMenu) {
    stroke(255);
    strokeWeight(2);
    fill(0);
    rect(width * 0.044, height * 0.232, 325, 420);
    noStroke();
    fill(255);
    textSize(22);
    textAlign(LEFT);

    text("War Menu", width * 0.048, height * 0.26);

    for (let i = 0; i < simulation.activeWars.length; i++) {
      let war = simulation.activeWars[i];

      text(war.attackersLeader.name + " vs. " + war.defendersLeader.name, width * 0.048, height * (0.3 + (i * 0.1)));
      text("Attackers: " + war.calculatePercentage(true) + "%", width * 0.048, height * (0.33 + (i * 0.1)));
      text("Defenders: " + war.calculatePercentage(false) + "%", width * 0.048, height * (0.36 + (i * 0.1)));
    }
  }
}
