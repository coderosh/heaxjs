import { Vector2D as Vector } from "@coderosh/vector";

import Mouse from "./Mouse";
import Composite from "./Composite";

class Heax {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public height: number;
  public width: number;
  public friction = 0.999;
  public groundFriction = 0.95;
  public gravity = new Vector(0, 0.5);
  public bounce = 0.9;
  public composites: Composite[] = [];
  public mouse: Mouse;

  /**
   * @param canvas Canvas element
   */
  constructor(canvas = document.querySelector("canvas")!) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.mouse = new Mouse(this);
  }

  /**
   * Clear the canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    return this;
  }

  /**
   * Render all composites
   */
  render() {
    for (const composite of this.composites) composite.render();
    return this;
  }

  /**
   * Update all composites
   */
  update(constraintBasedOnDimensionOfCanvas?: boolean) {
    for (const composite of this.composites)
      composite.update(constraintBasedOnDimensionOfCanvas);

    return this;
  }

  /**
   * Create a reactangle
   *
   * @param x Top left x coordinate
   * @param y Top left y coordinate
   * @param w Width of box
   * @param h Height of box
   * @param particleInfo Particle info
   * @param constraintInfo Constraint info
   *
   * @example
   * ```js
   * const reactangle = heax.createReactangle(0, 0, 100, 100, { color: "red" }, { width: 2 })
   * ```
   */
  createRectangle(
    x = 0,
    y = 0,
    w = 100,
    h = 100,
    particleInfo: any,
    constraintInfo: any
  ) {
    const rect = new Composite(this);

    rect.addParticle(x, y, x, y, particleInfo);
    rect.addParticle(x + w, y, x + w, h, particleInfo);
    rect.addParticle(x + w, y + h, x + w, y + h, particleInfo);
    rect.addParticle(x, y + h, x, y + h, particleInfo);

    for (let i = 0; i <= 3; i++)
      rect.addConstraint(i, i == 3 ? 0 : i + 1, constraintInfo);

    rect.addConstraint(1, 3, constraintInfo);
    rect.addConstraint(0, 2, constraintInfo);

    this.composites.push(rect);
    return rect;
  }

  /**
   * Create a rope
   *
   * @param positionFunction Function which returns x and y coordinate of each points based on indexes
   * @param segments No of segments
   * @param particleInfo Particle info
   * @param constraintInfo Constraint info
   *
   * @example
   * ```js
   * const fn = i => ({ x: 100 + i * 15, y: 100 + i * 15 })
   * const rope = heax.createRope(fn, 15, { color: "red" }, { width: 10 })
   * ```
   */
  createRope(
    positionFunction = (index: number) => ({
      x: 100 + index * 15,
      y: 100 + index * 15,
    }),
    segments = 15,
    particleInfo: any,
    constraintInfo: any
  ) {
    const rope = new Composite(this);

    for (let i = 0; i < segments; i++) {
      const { x, y } = positionFunction(i);
      rope.addParticle(x, y, x, y, particleInfo);
    }

    for (let i = 0; i < segments - 1; i++)
      rope.addConstraint(i, (i + 1) % segments, constraintInfo);

    this.composites.push(rope);
    return rope;
  }

  /**
   * Create a cloth
   * @param x Top left x coordinate
   * @param y Top left y coordinate
   * @param width Width of cloth
   * @param height Height of cloth
   * @param segments No of segments
   * @param offset Pin offset
   * @param particleInfo Particle info
   * @param constraintInfo Constraint info
   *
   * @example
   * ```js
   * const cloth = heax.createCloth(0, 0, 250, 250, 9, 2, { color: "red" }, { width: 5 })
   * ```
   */
  createCloth(
    x = 0,
    y = 0,
    width = 250,
    height = 250,
    segments = 9,
    offset = 2,
    particleInfo: any,
    constraintInfo: any
  ) {
    const position = new Vector(x, y);
    const cloth = new Composite(this);

    const sX = width / segments;
    const sY = height / segments;

    for (let y = 0; y < segments; y++) {
      for (let x = 0; x < segments; x++) {
        let px = position.x + x * sX;
        let py = position.y + y * sY;

        let particle = cloth.addParticle(px, py, px, py, particleInfo);

        // join current point and point before current point
        if (x !== 0)
          cloth.addConstraint(particle, y * segments + x - 1, constraintInfo);

        // join current point and previous column point
        if (y !== 0)
          cloth.addConstraint(particle, (y - 1) * segments + x, constraintInfo);

        if (y === 0 && x % offset === 0) particle.pinned = true;
      }
    }

    this.composites.push(cloth);
    return cloth;
  }
}

export default Heax;
