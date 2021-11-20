import type Particle from "./Particle";
import type Heax from "./Heax";

class Constraint {
  /**
   * Particle at one end
   */
  public particle1: Particle;

  /**
   * Particle at another end
   */
  public particle2: Particle;

  /**
   * Instance of heax class
   */
  public heax: Heax;

  /**
   * Color of constraint
   */
  public color: string;

  /**
   * Width of constraint
   */
  public width: number;

  /**
   * If true constraint will not be rendered
   */
  public hidden: boolean;

  /**
   * Distance between two particles
   */
  public distance: number;

  /**
   * Extent to which constraint resists deformation
   */
  public stiffness: number;

  /**
   * @param p1 Particle at one end
   * @param p2 Particle at another end
   * @param heax Instance of heax class
   * @param info Info about constraint
   */
  constructor(
    p1: Particle,
    p2: Particle,
    heax: Heax,
    info: {
      color?: string;
      width?: number;
      hidden?: boolean;
      stiffness?: number;
      distance?: number;
    } = {}
  ) {
    this.particle1 = p1;
    this.particle2 = p2;
    this.heax = heax;

    this.color = info.color || "black";
    this.width = info.width || 1;
    this.hidden = info.hidden || false;
    this.distance = info.distance || p1.position.dist(p2.position);
    this.stiffness = info.stiffness || 1;
  }

  /**
   * Render the constraint to the canvas
   */
  render() {
    if (this.hidden) return;

    const { ctx } = this.heax;

    ctx.beginPath();
    ctx.lineWidth = this.width;
    ctx.moveTo(this.particle1.position.x, this.particle1.position.y);
    ctx.lineTo(this.particle2.position.x, this.particle2.position.y);
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.closePath();
    return this;
  }

  /**
   * Update the particles position according to the original distance
   */
  update() {
    const diff = this.particle1.position.copy().sub(this.particle2.position);
    const dist = diff.len();

    diff.scale(((this.distance - dist) / dist) * this.stiffness * 0.5);

    const totalMass = this.particle1.mass + this.particle2.mass;

    if (!this.particle1.pinned) {
      this.particle1.position.x += (diff.x * this.particle1.mass) / totalMass;
      this.particle1.position.y += (diff.y * this.particle1.mass) / totalMass;
    }

    if (!this.particle2.pinned) {
      this.particle2.position.x -= (diff.x * this.particle2.mass) / totalMass;
      this.particle2.position.y -= (diff.y * this.particle2.mass) / totalMass;
    }

    return this;
  }
}

export default Constraint;
