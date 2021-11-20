import { Vector2D as Vector } from "@coderosh/vector";

import Particle from "./Particle";
import type Heax from "./Heax";

class Mouse {
  /**
   * Instance of heax class
   */
  public heax: Heax;
  /**
   * Position of mouse
   */
  public pos = new Vector(0, 0);

  /**
   * If mouse is down
   */
  public down = false;

  /**
   * Dragged particle
   */
  public draggedParticle: Particle | null = null;

  /**
   * Highlight color
   */
  public highlightColor: string = "black";

  /**
   * Select radius
   */
  public selectRadius = 20;

  /**
   *
   * @param heax Instance of heax class
   */
  constructor(heax: Heax) {
    this.heax = heax;
    heax.canvas.addEventListener("mousedown", this.onStart);
    heax.canvas.addEventListener("mousemove", this.onMove);
    heax.canvas.addEventListener("mouseup", this.onEnd);

    heax.canvas.addEventListener("touchstart", this.onStart);
    heax.canvas.addEventListener("touchmove", (e) => this.onMove(e.touches[0]));
    heax.canvas.addEventListener("touchend", this.onEnd);
    heax.canvas.addEventListener("touchcancel", this.onEnd);
  }

  private onStart = () => {
    this.down = true;
  };

  private onMove = (e: MouseEvent | Touch) => {
    const rect = this.heax.canvas.getBoundingClientRect();
    this.pos.x = e.clientX - rect.left;
    this.pos.y = e.clientY - rect.top;
  };

  private onEnd = () => {
    this.down = false;
    this.draggedParticle = null;
  };

  /**
   * Drag the nearest particle
   * @param draw Draw a circle around neareat particle
   */
  public drag(draw = true) {
    if (!this.down) this.draggedParticle = this.nearestParticle();

    if (!this.draggedParticle) return;

    if (draw) this.draw();

    if (this.down) this.draggedParticle.position = this.pos.copy();
  }

  private draw() {
    const ctx: CanvasRenderingContext2D = this.heax.ctx;
    const p = this.draggedParticle!;

    ctx.beginPath();
    ctx.arc(p.position.x, p.position.y, p.radius * 1.5, 0, Math.PI * 2);
    ctx.strokeStyle = this.highlightColor;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
  }

  private nearestParticle() {
    let nearestDist = Infinity;
    let particle_ = null;

    for (const composite of this.heax.composites) {
      for (const particle of composite.particles) {
        const dist = this.pos.dist((particle as Particle).position);

        if (dist < this.selectRadius && dist < nearestDist) {
          nearestDist = dist;
          particle_ = particle;
        }
      }
    }

    return particle_;
  }
}

export default Mouse;
