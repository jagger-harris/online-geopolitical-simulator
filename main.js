import {Point} from "./modules/geometry.js"
import getPolygonTriangles from "./modules/triangulate.js";
import {Node} from "./modules/node.js"

/**
 * Static data
 */
let landmasses;
let countries;
let landmassesTriangles;
let countriesTriangles;

/**
 * Node data
 */
let nodes = [];

/**
 * Mouse and zoom
 */
let scale = 1;
let offset;

/* Main anonymous instance for p5.js */
let simulator = new p5((sketch) => {
  sketch.preload = () => {
    countries = sketch.loadJSON("data/countries.json");
    landmasses = sketch.loadJSON("data/landmasses.json");
  }
  
  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    
    landmassesTriangles = getPolygonTriangles(landmasses);
    countriesTriangles = getPolygonTriangles(countries);

    //console.log(landmassesTriangles);

    /* Mouse transformations setup */
    offset = sketch.createVector(0, 0);
    window.addEventListener("wheel", event => {
      const scaleCalc = 1 - (event.deltaY / 1000);
      const mouse = sketch.createVector(sketch.mouseX, sketch.mouseY);
      scale *= scaleCalc;
      
      offset.sub(mouse).mult(scaleCalc).add(mouse);
    });

    for (let i = 0; i < countriesTriangles.length; i++) {
      nodes = nodes.concat(Node.create(sketch, 200, countriesTriangles[i]));
    }
  };

  sketch.draw = () => {
    sketch.background(40, 160, 255);
    
    /* Mouse transformations */
    sketch.translate(offset.x, offset.y);
    sketch.scale(scale);
    
    if (sketch.mouseIsPressed) {
      offset.x -= sketch.pmouseX - sketch.mouseX;
      offset.y -= sketch.pmouseY - sketch.mouseY;
    }

    //sketch.drawData(landmasses);
    sketch.drawData(countries);

    nodes.forEach(node => node.draw(sketch));

    /* Draw GUI */
    sketch.gui();
  };

  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  }

  sketch.gui = () => {
    /* Reset Matrix for GUI */
    sketch.resetMatrix();
      
    sketch.fill(255);
    sketch.textSize(30);
    sketch.textAlign(sketch.CENTER);
    sketch.text("Online Geopolitical Simulator | Jagger Harris", sketch.windowWidth * 0.5, 50);
  }

  sketch.drawData = (data) => {
    if (data) {
      for (let i = 0; i < data.data.length; i++) {
        sketch.fill(255);
        sketch.beginShape();

        for (let j = 0; j < data.data[i].vertices.length; j++) {
          let x = data.data[i].vertices[j][0];
          let y = data.data[i].vertices[j][1];
          let currentVertex = new Point(x, y);

          sketch.vertex(currentVertex.x, currentVertex.y);
        }

        sketch.endShape();
      }
    }
  }
});
