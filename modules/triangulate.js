import earcut from "../libraries/earcut.js";
import {Point, Triangle} from "./geometry.js"

export default getPolygonTriangles;

function getPolygonTriangles(data) {
  let triangles = [];

  for (let i = 0; i < data.data.length; i++) {
    let currentIndices;
    let currentTriangles = [];
    let flattenedData = [];

    for (let j = 0; j < data.data[i].vertices.length; j++) {
      let x = data.data[i].vertices[j][0];
      let y = data.data[i].vertices[j][1];
  
      flattenedData.push(x);
      flattenedData.push(y);
    }
  
    currentIndices = earcut(flattenedData);
  
    for (let j = 0; j < currentIndices.length; j++) {
      if (j % 3 == 0) {
        let x1 = data.data[i].vertices[currentIndices[j]][0];
        let y1 = data.data[i].vertices[currentIndices[j]][1];
        let x2 = data.data[i].vertices[currentIndices[j + 1]][0];
        let y2 = data.data[i].vertices[currentIndices[j + 1]][1];
        let x3 = data.data[i].vertices[currentIndices[j + 2]][0];
        let y3 = data.data[i].vertices[currentIndices[j + 2]][1];
  
        currentTriangles.push(new Triangle(new Point(x1, y1), new Point(x2, y2), new Point(x3, y3)))
      }
    }

    triangles.push(currentTriangles);
  }

  return triangles;
}
