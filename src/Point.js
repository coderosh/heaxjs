import Heax from "./Heax";
import Vector from "./Vector";

class Point {
  /**
   * @param {Vector} pos - current position of the point
   * @param {Vector} oldPos - position of the point right before it achieved current position
   * @param {Heax} heax - heax instance
   * @param {Object} [info] - Info about the point
   * @param {number} [info.radius=2] - radius of the point
   * @param {string} [info.color=black] - color of the point
   * @param {boolean} [info.hidden=false] - if true the point will not be visible
   * @param {boolean} [info.pinned=false] - if true the point will be pinned
   * @param {number} [info.mass=1] - mass of point
   */
  constructor(pos, oldPos, heax, info = {}) {
    const {
      radius = 5,
      color = "black",
      hidden = false,
      pinned = false,
      mass = 1,
    } = info;

    /**
     * @type {Vector}
     * @description current position of the point
     */
    this.pos = pos || new Vector();

    /**
     * @type {Vector}
     * @description position of the point right before current position
     */
    this.oldPos = oldPos || this.pos.copy();

    /**
     * @type {Heax}
     * @description heax instance
     */
    this.heax = heax;

    /**
     * @type {number}
     * @description radius of the point
     */
    this.radius = radius;

    /**
     * @type {string}
     * @description color of the point
     */
    this.color = color;

    /**
     * @type {boolean}
     * @description if true the point will not be visible
     */
    this.hidden = hidden;

    /**
     * @type {boolean}
     * @description if true the point will be pinned
     */
    this.pinned = pinned;

    /**
     * @type {Vector}
     * @description mass of point
     */
    this.mass = mass;

    /**
     * @type {Vector}
     * @description velocity of the point (current position - previous position)
     */
    this.vel = Vector.sub(this.pos, this.oldPos);
    this.vel.add(this.heax.gravity);
  }

  /**
   * Render the point to the canvas
   */
  render() {
    if (this.hidden) return;

    this.heax.ctx.beginPath();
    this.heax.ctx.fillStyle = this.color;
    this.heax.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    this.heax.ctx.fill();
    this.heax.ctx.closePath();
  }

  /**
   * Update the position and velocity of the point
   */
  update() {
    if (this.pinned) return;

    this.vel = Vector.sub(this.pos, this.oldPos).scale(this.heax.friction);

    this.oldPos.x = this.pos.x;
    this.oldPos.y = this.pos.y;

    this.vel.add(this.heax.gravity);

    if (this.pos.y >= this.heax.height - this.radius && this.vel.lenSqr() > 0) {
      this.vel.x *= this.heax.groundFriction;
    }

    this.pos.add(this.vel);
  }

  /**
   * constrain the point
   */
  constrain() {
    const { bounce, width, height } = this.heax;

    if (this.pos.x > width - this.radius) {
      this.pos.x = width - this.radius;
      this.oldPos.x = this.pos.x + this.vel.x * bounce;
    } else if (this.pos.x < this.radius) {
      this.pos.x = this.radius;
      this.oldPos.x = this.pos.x + this.vel.x * bounce;
    }

    if (this.pos.y > height - this.radius) {
      this.pos.y = height - this.radius;
      this.oldPos.y = this.pos.y + this.vel.y * bounce;
    } else if (this.pos.y < this.radius) {
      this.pos.y = this.radius;
      this.oldPos.y = this.pos.y + this.vel.y * bounce;
    }
  }
}

export default Point;
