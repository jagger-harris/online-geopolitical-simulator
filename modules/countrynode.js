/**
 * Object that is essential to simulation, country data are represented by this
 */
class CountryNode {
  constructor(data, amount, point) {
    this.size = 2;
    this.point = point;
    this.population = Math.floor(data.population / amount);
    this.fertilityRate = data.fertilityRate;
    this.lifespan = data.lifespan;
    this.mortalityRate = data.mortalityRate;
    this.selected = false;
    this.borderVertices = [
      new Point(this.point.x - 10, this.point.y),
      new Point(this.point.x + 10, this.point.y),
      new Point(this.point.x, this.point.y - 10),
      new Point(this.point.x, this.point.y + 10)]
  }

  draw() {
    if (this.selected) {
      fill(230, 230, 230);
    } else if (this.hover()) {
      fill(150, 150, 255);
    } else {
      fill(100, 100, 255);
    }

    ellipse(this.point.x, this.point.y, this.size, this.size);
  }

  hover() {
    return this.mouseInsideNode();
  }

  /* https://math.stackexchange.com/questions/198764/how-to-know-if-a-point-is-inside-a-circle */
  mouseInsideNode() {
    let mX = (mouseX - offset.x) / zoom;
    let mY = (mouseY - offset.y) / zoom;
    let circlePoint = new Point(mX, mY);
    let x = Math.abs(this.point.x - circlePoint.x);
    let y = Math.abs(this.point.y - circlePoint.y);
    let distance = Math.sqrt(x * x + y * y);

    if (distance < this.size * 0.5) {
      return true;
    }

    return false;
  }

  static create(data, amount, trianglePoints) {
    return Array.from(Array(amount), () => {
      const triangleAreas = [];
      const areaRatios = [];

      /* Calculate area for each triangle to determine ratio for node placement */
      for (let i = 0; i < trianglePoints.length; i++) {
        let pointA = trianglePoints[i].a;
        let pointB = trianglePoints[i].b;
        let pointC = trianglePoints[i].c;
        let lengthA = dist(pointA.x, pointA.y, pointB.x, pointB.y);
        let lengthB = dist(pointC.x, pointC.y, pointB.x, pointB.y);
        let lengthC = dist(pointC.x, pointC.y, pointA.x, pointA.y);;

        /* Heron's formula https://en.wikipedia.org//wiki/Heron's_formula */
        let s = (lengthA + lengthB + lengthC) * 0.5;
        let area = Math.sqrt(s * (s - lengthA) * (s - lengthB) * (s - lengthC));

        triangleAreas.push(area);
      }

      /* Add up all areas and determine percentages */
      let totalArea = 0;
      
      for (let i = 0; i < triangleAreas.length; i++) {
        totalArea += triangleAreas[i];
      }

      for (let i = 0; i < trianglePoints.length; i++) {
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
      const x = (1 - Math.sqrt(r1)) * trianglePoints[areaCheck - 1].a.x + (Math.sqrt(r1) * (1 - r2)) * trianglePoints[areaCheck - 1].b.x + (Math.sqrt(r1) * r2) * trianglePoints[areaCheck - 1].c.x;
      const y = (1 - Math.sqrt(r1)) * trianglePoints[areaCheck - 1].a.y + (Math.sqrt(r1) * (1 - r2)) * trianglePoints[areaCheck - 1].b.y + (Math.sqrt(r1) * r2) * trianglePoints[areaCheck - 1].c.y;
      const point = new Point(x, y);

      return new this(data, amount, point);
    })
  }
}
