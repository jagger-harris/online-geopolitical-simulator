/**
 * @class Point representing x and y.
 * 
 * Used to easily store point information.
 */
class Point {
  /**
   * Creates an instance of a point.
   * 
   * @param {number} x X position.
   * @param {number} y Y position.
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

/**
 * @class Triangle for p5.js.
 * 
 * Used to easily store triangle information.
 */
class Triangle {
  /**
   * Creates an instance of a triangle.
   * 
   * @param {Point} a First point.
   * @param {Point} b Second point.
   * @param {Point} c Third point.
   */
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}
