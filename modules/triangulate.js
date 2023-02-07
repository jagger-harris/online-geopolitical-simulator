import earcut from "./earcut.js";

export default triangulate;

function triangulate(customShapeJsonData) {
  let triangles = [];
  let flattenedData = [];

  for (let i = 0; i < customShapeJsonData.land.length; i++) {
    let x = customShapeJsonData.land[i][0];
    let y = customShapeJsonData.land[i][1];

    flattenedData.push(x);
    flattenedData.push(y);
  }

  triangles = earcut(flattenedData);

  return triangles;
}
