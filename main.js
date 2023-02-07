import triangulate from "./modules/triangulate.js";

/**
 * Globals
*/

let nodeAmount = 500;
let nodes = [];
let fixedNodes = [];
let lines = [];
let landJsonData;
let countryOneJsonData;
let trianglePointsLand = [];

let scale = 1;
let offset;

const scene = (p) => {
  p.setup = async function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    landJsonData = await getJsonData("../data/vertices.json");
    offset = p.createVector(0, 0);
    let triangleIndicesLand = triangulate(landJsonData);

    window.addEventListener("wheel", event => {
      const scaleCalc = 1 - (event.deltaY / 1000);
      const mouse = p.createVector(p.mouseX, p.mouseY);
      scale *= scaleCalc;
      
      offset.sub(mouse).mult(scaleCalc).add(mouse);
    });

    for (let i = 0; i < landJsonData.land.length; i++) {
      let x = landJsonData.land[i][0];
      let y = landJsonData.land[i][1];
      let point = new Point(x, y);

      fixedNodes.push(point);
    }

    for (let i = 0; i < triangleIndicesLand.length; i++) {
      if (i % 3 == 0) {
        let x1 = fixedNodes[Number(triangleIndicesLand[i])].x;
        let y1 = fixedNodes[Number(triangleIndicesLand[i])].y;
        let x2 = fixedNodes[Number(triangleIndicesLand[i + 1])].x;
        let y2 = fixedNodes[Number(triangleIndicesLand[i + 1])].y;
        let x3 = fixedNodes[Number(triangleIndicesLand[i + 2])].x;
        let y3 = fixedNodes[Number(triangleIndicesLand[i + 2])].y;

        trianglePointsLand.push(new Triangle(new Point(x1, y1), new Point(x2, y2), new Point(x3, y3)))
      }
    }

    nodes = Node.create(nodeAmount, p);
  }

  p.draw = function() {
    p.background(40, 160, 255);

    /* Translations */
    p.translate(offset.x, offset.y);
    p.scale(scale);
    
    if (p.mouseIsPressed) {
      offset.x -= p.pmouseX - p.mouseX;
      offset.y -= p.pmouseY - p.mouseY;
    }

    customShape(landJsonData, p);

    nodes.forEach(node => node.draw(p));

    /* GUI */
    p.drawGui();
  }

  p.drawGui = function() {
    /* Reset Matrix for GUI */
    p.resetMatrix();
      
    p.fill(255);
    p.textSize(30);
    p.textAlign(p.CENTER);
    p.text("Online Geopolitical Simulator | Jagger Harris", p.windowWidth * 0.5, 50);
  }
}

let p5Scene = new p5(scene);

async function getJsonData(uri) {
  let jsonFile = await fetch(uri);
  let jsonData = await jsonFile.json();

  return jsonData;
}

function customShape(jsonData, p) {
  if (jsonData) {
    p.fill(255);
    p.beginShape();

    for (let i = 0; i < jsonData.land.length; i++) {
      let x = jsonData.land[i][0];
      let y = jsonData.land[i][1];
      let currentVertex = new Point(x, y);

      for (let j = 0; j < jsonData.land.length; j++) {
        p.vertex(currentVertex.x, currentVertex.y);
      }
    }

    p.endShape();
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Triangle {
  constructor(pointOne, pointTwo, pointThree) {
    this.pointOne = pointOne;
    this.pointTwo = pointTwo;
    this.pointThree = pointThree;
  }
}

class Node {
  constructor(point) {
    this.x = point.x;
    this.y = point.y;
  }

  getPoint() {
    return new Point(this.x, this.y);
  }
  
  draw(p) {
    p.fill(100);
    p.noStroke();
    p.circle(this.x, this.y, 5);
  }
  
  static create(count, p) {
    return Array.from(Array(count), () => {
      const triangleAreas = [];
      const areaRatios = [];

      /* Calculate area for each triangle to determine ratio for node placement */
      for (let i = 0; i < trianglePointsLand.length; i++) {
        let pointOne = trianglePointsLand[i].pointOne;
        let pointTwo = trianglePointsLand[i].pointTwo;
        let pointThree = trianglePointsLand[i].pointThree;
        let lengthOne = p.dist(pointOne.x, pointOne.y, pointTwo.x, pointTwo.y);
        let lengthTwo = p.dist(pointThree.x, pointThree.y, pointTwo.x, pointTwo.y);
        let lengthThree = p.dist(pointThree.x, pointThree.y, pointOne.x, pointOne.y);;

        /* Heron's formula https://en.wikipedia.org//wiki/Heron's_formula */
        let s = (lengthOne + lengthTwo + lengthThree) * 0.5;
        let area = Math.sqrt(s * (s - lengthOne) * (s - lengthTwo) * (s - lengthThree));

        triangleAreas.push(area);
      }

      /* Add up all areas and determine percentages */
      let totalArea = 0;
      for (let i = 0; i < triangleAreas.length; i++) {
        totalArea += triangleAreas[i];
      }

      for (let i = 0; i < trianglePointsLand.length; i++) {
        areaRatios.push(triangleAreas[i] / totalArea);
      }

      /* Chose triangle based on area */
      let rTriangle = Math.random();
      let areaCheck = 0;

      while(rTriangle > 0) {
        rTriangle -= areaRatios[areaCheck];
        areaCheck++;
      }

      /* https://stackoverflow.com/questions/4778147/sample-random-point-in-triangle */
      const r1 = Math.random();
      const r2 = Math.random();
      const x = (1 - Math.sqrt(r1)) * trianglePointsLand[areaCheck - 1].pointOne.x + (Math.sqrt(r1) * (1 - r2)) * trianglePointsLand[areaCheck - 1].pointTwo.x + (Math.sqrt(r1) * r2) * trianglePointsLand[areaCheck - 1].pointThree.x;
      const y = (1 - Math.sqrt(r1)) * trianglePointsLand[areaCheck - 1].pointOne.y + (Math.sqrt(r1) * (1 - r2)) * trianglePointsLand[areaCheck - 1].pointTwo.y + (Math.sqrt(r1) * r2) * trianglePointsLand[areaCheck - 1].pointThree.y;
      const point = new Point(x, y);

      return new this(point);
    })
  }
}
