import { Vector2D as Vector } from "@coderosh/vector";

import Particle from "./Particle";
import Constraint from "./Constraint";
import type Heax from "./Heax";

class Composite {
  /**
   * Instance of heax class
   */
  public heax: Heax;
  /**
   * No of times to update constraints in single frame
   */
  public iterations: number;

  /**
   * Array if particles
   */
  public particles: Particle[] = [];

  /**
   * Array of constraints
   */
  public constraints: Constraint[] = [];

  /**
   * @param heax Instance of heax class
   * @param iterations No of times to update constraints in single frame
   */
  constructor(heax: Heax, iterations = 5) {
    this.heax = heax;
    this.iterations = iterations;
  }

  /**
   * Add new particle
   * @param x x coordinate
   * @param y y coordinate
   * @param ox Old x coordinate
   * @param oy Old y coodinate
   * @param info Info about the particle
   *
   * @example
   * ```js
   * composite.addParticle(0, 0, 10, 10, { color: "red" })
   * ```
   */
  addParticle(
    x: number,
    y: number,
    ox: number,
    oy: number,
    info: any
  ): Particle;

  /**
   * Add new particle
   * @param pos Current position of particle
   * @param oldPos Old position of particle
   * @param info Info about the particle
   *
   * @example
   * ```js
   * const pos = new Vector(10, 10)
   * const oldPos = new Vector(0, 0)
   *
   * composite.addParticle(pos, oldPos, { color: "red" })
   * ```
   */
  addParticle(pos: Vector, oldPos: Vector, info: any): Particle;

  addParticle(...args: any[]) {
    const [x, y, ox_or_info, oy, info] = args;

    let pos: Vector;
    let oldPos: Vector;
    let info_: any;

    if (typeof x === "number") {
      pos = new Vector(x, y);
      oldPos = new Vector(ox_or_info, oy);
      info_ = info;
    } else if (x instanceof Vector) {
      pos = x;
      oldPos = y;
      info_ = ox_or_info;
    } else {
      throw new Error("Invalid arguments");
    }

    const particle = new Particle(pos, oldPos, this.heax, info_);
    this.particles.push(particle);
    return particle;
  }

  /**
   * Add new constraint
   * @param p1 First particle
   * @param p2 Second Particle
   * @param info Info about the constraint
   *
   * @example
   * ```js
   * composit.addConstraint(1, 2, { color: "red" })
   *
   * composite.addConstraint(particle1, particle2, { width: 10 })
   *
   * composite.addConstraint(1, particle2, { width: 10 })
   * ```
   */
  addConstraint(p1: number | Particle, p2: number | Particle, info: any) {
    if (typeof p1 === "number") p1 = this.particles[p1];
    if (typeof p2 === "number") p2 = this.particles[p2];

    const constraint = new Constraint(p1, p2, this.heax, info);
    this.constraints.push(constraint);
    return constraint;
  }

  /**
   * Render all particles and constraints
   */
  render() {
    for (const constraint of this.constraints) constraint.render();
    for (const particle of this.particles) particle.render();
    return this;
  }

  /**
   * Update all particles and constraints
   * @param constraintBasedOnDimensionOfCanvas If particles should be stopped by the canvas height and width
   */
  update(constraintBasedOnDimensionOfCanvas = true) {
    for (const particle of this.particles) particle.update();

    for (let i = 0; i < this.iterations; i++) {
      for (const constraint of this.constraints) constraint.update();

      if (constraintBasedOnDimensionOfCanvas)
        for (const particle of this.particles) particle.constrain();
    }

    return this;
  }

  /**
   * Don't render constraints
   */
  hideConstraints() {
    for (const constraint of this.constraints) constraint.hidden = true;
    return this;
  }

  /**
   * Don't render particles
   */
  hideParticles() {
    for (const particle of this.particles) particle.hidden = true;
    return this;
  }

  /**
   * Tear the composite
   *
   * @param tearSensitivity Tear sensitivity
   */
  tear(tearSensitivity: number) {
    for (const stick of this.constraints) {
      const dist = stick.particle1.position.dist(stick.particle2.position);

      if (dist > tearSensitivity) {
        this.constraints = this.constraints.filter((c) => c != stick);
      }
    }

    return this;
  }
}

export default Composite;
