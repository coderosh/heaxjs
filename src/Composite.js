import Heax from "./Heax";
import Vector from "./Vector";
import Point from "./Point";
import Stick from "./Stick";

class Composite {
  /**
   * @param {Heax} heax - heax instance
   * @param {number} iterations - iterations
   */
  constructor(heax, iterations = 5) {
    /**
     * @type {Heax}
     * @description heax instance
     */
    this.heax = heax;

    /**
     * @type {Point[]}
     * @description array of points
     */
    this.points = [];

    /**
     * @type {Stick[]}
     * @description array of sticks
     */
    this.sticks = [];

    /**
     * @type {number}
     * @description iteration
     */
    this.iterations = iterations;

    /**
     * @type {boolean}
     * @description true if the points should constrain by cavnas dimensions
     */
    this.cDC = this.heax.cDC;
  }

  /**
   * add new point
   * @param {number} x - x coordinate
   * @param {number} y - y coodrinate
   * @param {number} ox - prev x coordinate
   * @param {number} oy - prev y coordinate
   * @param {Object} info - info about the point
   */
  addPoint(x, y, ox, oy, info) {
    const pos = new Vector(x, y);
    const oldPos = new Vector(ox, oy);

    const point = new Point(pos, oldPos, this.heax, info);
    this.points.push(point);

    return point;
  }

  /**
   * add new stick
   * @param {Point} p1 - first point
   * @param {Point|number} p2 - last point
   * @param {Object} info - info about the stick
   */
  addStick(p1, p2, info) {
    if (typeof p1 === "number") p1 = this.points[p1];
    if (typeof p2 === "number") p2 = this.points[p2];

    const stick = new Stick(p1, p2, this.heax, info);
    this.sticks.push(stick);

    return stick;
  }

  /**
   * render points and sticks
   */
  render() {
    for (const stick of this.sticks) {
      stick.render();
    }

    for (const point of this.points) {
      point.render();
    }
  }

  /**
   * update points and sticks
   */
  update() {
    for (const point of this.points) {
      point.update();
    }

    for (let i = 0; i < this.iterations; i++) {
      for (const stick of this.sticks) {
        stick.update();
      }

      if (!this.cDC) {
        for (const point of this.points) {
          point.constrain();
        }
      }
    }
  }

  /**
   * hide all sticks
   */
  hideSticks() {
    for (const stick of this.sticks) {
      stick.hidden = true;
    }
  }

  /**
   * hide all points
   */
  hidePoints() {
    for (const point of this.points) {
      point.hidden = true;
    }
  }

  /**
   * Tear the composite
   * @param {number} tearSensitivity - tear sensitivity
   */
  tear(tearSensitivity) {
    for (const stick of this.sticks) {
      const dist = stick.p1.pos.dist(stick.p2.pos);

      if (dist > tearSensitivity) {
        this.sticks = this.sticks.filter((c) => c != stick);
      }
    }
  }
}

export default Composite;
