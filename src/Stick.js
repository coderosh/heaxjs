import Heax from "./Heax";
import Point from "./Point";
import Vector from "./Vector";

class Stick {
  /**
   * @param {Point} p1 - point at first end
   * @param {Point} p2 - point at second end
   * @param {Heax} heax - heax instance
   * @param {Object} [info] - info  about the constrain
   * @param {string} [info.distance] - resting distance of the stick
   * @param {number} [info.stiffness] - extent to which stick resists deformation
   * @param {string} [info.color] - color of stick
   * @param {number} [info.width] - width of stick
   * @param {boolean} [info.hidden] - if true stick will not be visible
   */
  constructor(p1, p2, heax, info = {}) {
    const {
      distance = p1.pos.dist(p2.pos),
      stiffness = 1,
      color = "black",
      width = 1,
      hidden = false,
    } = info;

    /**
     * @type {Point}
     * @description first point
     */
    this.p1 = p1;

    /**
     * @type {Point}
     * @description last point
     */
    this.p2 = p2;

    /**
     * @type {string}
     * @description color of the stick
     */
    this.color = color;

    /**
     * @type {number}
     * @description extent to which stick resists deformation
     */
    this.stiffness = stiffness;

    /**
     * @type {number}
     * @description resting distance of stick
     */
    this.distance = distance;

    /**
     * @type {number}
     * @description width of stick
     */
    this.width = width;

    /**
     * @type {boolean}
     * @description if true stick will not be visible
     */
    this.hidden = hidden;

    /**
     * @type {Heax}
     * @description heax instance
     */
    this.heax = heax;
  }

  /**
   * Update stick
   */
  update() {
    const diff = Vector.sub(this.p1.pos, this.p2.pos);
    const dist = diff.length();

    diff.scale(((this.distance - dist) / dist) * this.stiffness * 0.5);

    const totalMass = this.p1.mass + this.p2.mass;

    if (!this.p1.pinned) {
      this.p1.pos.x += (diff.x * this.p1.mass) / totalMass;
      this.p1.pos.y += (diff.y * this.p1.mass) / totalMass;
    }

    if (!this.p2.pinned) {
      this.p2.pos.x -= (diff.x * this.p2.mass) / totalMass;
      this.p2.pos.y -= (diff.y * this.p2.mass) / totalMass;
    }
  }

  /**
   * Render stick
   */
  render() {
    if (this.hidden) return;

    const { ctx } = this.heax;
    ctx.beginPath();
    ctx.lineWidth = this.width;
    ctx.moveTo(this.p1.pos.x, this.p1.pos.y);
    ctx.lineTo(this.p2.pos.x, this.p2.pos.y);
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();
  }
}

export default Stick;
