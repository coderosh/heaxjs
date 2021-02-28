import Composite from "./Composite";
import Mouse from "./Mouse";
import Vector from "./Vector";

class Heax {
  /**
   * @param {HTMLCanvasElement} [canvas] - canvas element
   */
  constructor(canvas = document.querySelector("canvas")) {
    /**
     * @type {HTMLCanvasElement}
     * @description canvas element
     */
    this.canvas = canvas;

    /**
     * @type {CanvasRenderingContext2D}
     * @description canvas rendering 2d context
     */
    this.ctx = this.canvas.getContext("2d");

    /**
     * @type {number}
     * @description height of canvas
     */
    this.height = this.canvas.height;

    /**
     * @type {number}
     * @description width of canvas
     */
    this.width = this.canvas.width;

    /**
     * @type {number}
     * @description friction
     */
    this.friction = 0.999;

    /**
     * @type {number}
     * @description ground friction
     */
    this.groundFriction = 0.95;

    /**
     * @type {Vector}
     * @description gravity
     */
    this.gravity = new Vector(0, 0.5);

    /**
     * @type {number}
     * @description bounce
     */
    this.bounce = 0.9;

    /**
     * @type {Composite[]}
     * @description array of composites
     */
    this.composites = [];

    /**
     * @type {boolean}
     * @description true if the points should constrain by cavnas dimensions
     */
    this.cDC = false;

    /**
     * @type {Mouse}
     * @description mouse handler
     */
    this.mouse = new Mouse(this);
  }

  /**
   * Clear canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Render all composites
   */
  render() {
    for (const c of this.composites) {
      c.render();
    }
  }

  /**
   * Update all composites
   */
  update() {
    for (const c of this.composites) {
      c.update();
    }
  }

  /**
   * Create a box
   * @param {number} x - top left x coordinate
   * @param {number} y - top left y coordinate
   * @param {number} w  - width of box
   * @param {number} h - height of box
   * @param {Object} pInfo - point info
   * @param {Object} cInfo - stick info
   */
  box(x = 0, y = 0, w = 100, h = 100, pInfo, cInfo) {
    const box = new Composite(this);

    box.addPoint(x, y, x, y, pInfo);
    box.addPoint(x + w, y, x + w, h, pInfo);
    box.addPoint(x + w, y + h, x + w, y + h, pInfo);
    box.addPoint(x, y + h, x, y + h, pInfo);

    for (let i = 0; i <= 3; i++) box.addStick(i, i == 3 ? 0 : i + 1, cInfo);

    box.addStick(1, 3, cInfo);
    box.addStick(0, 2, cInfo);

    this.composites.push(box);
    return box;
  }

  /**
   * Create a rope
   * @param {Function} posFn - function which returns position for points based in indexs
   * @param {number} segments - no of segments
   * @param {Object} pInfo - point info
   * @param {Object} cInfo - stick info
   */
  rope(posFn, segments = 15, pInfo, cInfo) {
    const rope = new Composite(this);

    posFn = posFn || ((i) => ({ x: 100 + i * 15, y: 100 + i * 15 }));

    for (let i = 0; i < segments; i++) {
      let { x, y } = posFn(i);
      rope.addPoint(x, y, x, y, pInfo);
    }

    for (let i = 0; i < segments - 1; i++) {
      rope.addStick(i, (i + 1) % segments, cInfo);
    }

    this.composites.push(rope);
    return rope;
  }

  /**
   * Create a cloth
   * @param {Vector} pos - position of top left end point
   * @param {number} width - width of cloth
   * @param {number} height - height of cloth
   * @param {number} segments - no of segments
   * @param {number} offset - pin offset
   * @param {Object} pInfo - point info
   * @param {Object} cInfo - stick info
   */
  cloth(
    pos = new Vector(50, 0),
    width = 250,
    height = 250,
    segments = 9,
    offset = 2,
    pInfo,
    cInfo
  ) {
    const cloth = new Composite(this);

    const sX = width / segments;
    const sY = height / segments;

    for (let y = 0; y < segments; y++) {
      for (let x = 0; x < segments; x++) {
        let px = pos.x + x * sX;
        let py = pos.y + y * sY;

        let point = cloth.addPoint(px, py, px, py, pInfo);

        // join current point and point before current point
        x === 0 || cloth.addStick(point, y * segments + x - 1, cInfo);

        // join current point and previous column point
        y === 0 || cloth.addStick(point, (y - 1) * segments + x, cInfo);

        y == 0 && x % offset == 0 && (point.pinned = true);
      }
    }

    this.composites.push(cloth);
    return cloth;
  }

  /**
   * Create a tire
   * @param {number} x - y coordinate of center of tire
   * @param {number} y - y coordinate of center of tire
   * @param {radius} r - radius of tire
   * @param {number} s - no of segments
   * @param {number} [rS] - stiffness of spoke
   * @param {number} [sS] - stiffness of surface
   * @param {Object} pInfo - point info
   * @param {Object} cInfo - stick info
   */
  tire(x = 100, y = 100, r = 50, s = 12, rS = 1, sS = 1, pInfo, cInfo) {
    const tire = new Composite(this);
    const step = (Math.PI * 2) / s;

    for (let i = 0; i < s; i++) {
      const px = x + Math.cos(step * i) * r;
      const py = y + Math.sin(step * i) * r;
      tire.addPoint(px, py, px, py, pInfo);
    }

    const center = tire.addPoint(x, y, x, y, pInfo);

    for (let i = 0; i < s; i++) {
      tire.addStick(i, (i + 1) % s, { ...cInfo, stiffness: sS });
      tire.addStick(i, center, { ...cInfo, stiffness: rS });
      tire.addStick(i, (i + (s === 5 ? 6 : 5)) % s, {
        ...cInfo,
        stiffness: sS,
      });
    }

    this.composites.push(tire);
    return tire;
  }
}

export default Heax;
