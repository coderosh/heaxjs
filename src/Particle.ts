import { Vector2D as Vector } from "@coderosh/vector";

import type Heax from "./Heax";

class Particle {
  /**
   * Current position of particle
   */
  public position: Vector;

  /**
   * Position of particle right before it achieved current position
   */
  public oldPosition: Vector;

  /**
   * Radius of the particle
   */
  public radius: number;

  /**
   * Color of the particle
   */
  public color: string;

  /**
   * Mass of the particle
   */
  public mass: number;

  /**
   * If true the particle will be pinned to the current position.
   */
  public pinned: boolean;

  /**
   * If true the particle will not be rendered on the canvas
   */
  public hidden: boolean;

  /**
   * Velocity of the particle (current position - old position)
   */
  public velocity: Vector;

  /**
   * Instance of heax class
   */
  public heax: Heax;

  /**
   * @param position Current position of particle
   * @param oldPosition Position of particle right before it achieved current position
   * @param heax Instance of heax class
   * @param info Info about the particle
   */
  constructor(
    position: Vector,
    oldPosition: Vector,
    heax: Heax,
    info: {
      radius?: number;
      color?: string;
      mass?: number;
      pinned?: boolean;
      hidden?: boolean;
    } = {}
  ) {
    this.heax = heax;

    this.position = position || new Vector();
    this.oldPosition = oldPosition || new Vector();

    this.radius = info.radius || 5;
    this.color = info.color || "black";
    this.mass = info.mass || 1;
    this.hidden = info.hidden || false;
    this.pinned = info.pinned || false;

    this.velocity = this.position
      .copy()
      .sub(this.oldPosition)
      .add(this.heax.gravity);
  }

  /**
   * Renders the particle to the canvas
   */
  render() {
    if (this.hidden) return;

    const { ctx } = this.heax;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    return this;
  }

  /**
   * Update the position and velocity of the particle
   */
  update() {
    if (this.pinned) return;

    this.velocity = this.position
      .copy()
      .sub(this.oldPosition)
      .scale(this.heax.friction);

    this.oldPosition.x = this.position.x;
    this.oldPosition.y = this.position.y;

    this.velocity.add(this.heax.gravity);

    if (
      this.position.y >= this.heax.height - this.radius &&
      this.velocity.lenSqr() > 0
    )
      this.velocity.x *= this.heax.groundFriction;

    this.position.add(this.velocity);
    return this;
  }

  /**
   * Constrain the particle within canvas height and width
   */
  constrain() {
    const { bounce, width, height } = this.heax;

    if (this.position.x > width - this.radius) {
      this.position.x = width - this.radius;
      this.oldPosition.x = this.position.x + this.velocity.x * bounce;
    } else if (this.position.x < this.radius) {
      this.position.x = this.radius;
      this.oldPosition.x = this.position.x + this.velocity.x * bounce;
    }

    if (this.position.y > height - this.radius) {
      this.position.y = height - this.radius;
      this.oldPosition.y = this.position.y + this.velocity.y * bounce;
    } else if (this.position.y < this.radius) {
      this.position.y = this.radius;
      this.oldPosition.y = this.position.y + this.velocity.y * bounce;
    }

    return this;
  }
}

export default Particle;
