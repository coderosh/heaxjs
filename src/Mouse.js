import Heax from "./Heax";
import Point from "./Point";
import Vector from "./Vector";

class Mouse {
  /**
   * @param {Heax} heax - heax instance
   */
  constructor(heax) {
    /**
     * @type {Heax}
     * @description heax instance
     */
    this.heax = heax;

    /**
     * @type {Vector}
     * @description mouse position
     */
    this.pos = new Vector();

    /**
     * @type {boolean}
     * @description true if mouse is down
     */
    this.down = false;

    /**
     * @type {null|Point}
     * @description point dragged by mouse
     */
    this.draggedPpoint = null;

    /**
     * @type {string}
     * @description highlightColor of highlight (around dragged point)
     */
    this.highlightColor = "black";

    /**
     * @type {number}
     * @description selection radius
     */
    this.selectRadius = 20;

    const { canvas } = this.heax;
    canvas.addEventListener("mousedown", this._onStart);
    canvas.addEventListener("mousemove", this._onMove);
    window.addEventListener("mouseup", this._onEnd);

    canvas.addEventListener("touchstart", this._onStart);
    canvas.addEventListener("touchmove", (e) => this._onMove(e.touches[0]));
    window.addEventListener("touchend", this._onEnd);
    window.addEventListener("touchcancel", this._onEnd);
  }

  _onStart = () => {
    this.down = true;
  };

  _onMove = (e) => {
    const rect = this.heax.canvas.getBoundingClientRect();
    this.pos.x = e.clientX - rect.left;
    this.pos.y = e.clientY - rect.top;
  };

  _onEnd = () => {
    this.down = false;
    this.draggedPpoint = null;
  };

  /**
   * Drag the nearest point
   * @param {boolean} draw - draw a highlight around the nearest point
   */
  drag(draw = true) {
    this.down || (this.draggedPpoint = this.nearestPoint());

    if (!this.draggedPpoint) return;

    draw && this.draw();
    this.down && (this.draggedPpoint.pos = this.pos.copy());
  }

  /**
   * Draw over a point
   */
  draw() {
    let p = this.draggedPpoint;
    this.heax.ctx.beginPath();
    this.heax.ctx.arc(p.pos.x, p.pos.y, p.radius * 1.5, 0, Math.PI * 2);
    this.heax.ctx.strokeStyle = this.highlightColor;
    this.heax.ctx.lineWidth = 1;
    this.heax.ctx.stroke();
    this.heax.ctx.closePath();
  }

  /**
   * Find nearest point from mouse
   */
  nearestPoint() {
    let nearestDist = Infinity;
    let prtcl = null;
    for (const composite of this.heax.composites) {
      for (const point of composite.points) {
        let dist = point.pos.dist(this.pos);

        if (dist < this.selectRadius && dist < nearestDist) {
          nearestDist = dist;
          prtcl = point;
        }
      }
    }

    return prtcl;
  }
}

export default Mouse;
