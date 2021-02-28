class Vector {
  /**
   * @param {number} [x=0] - x coordinate of vector
   * @param {number} [y=0] - y coordinate of vector
   */
  constructor(x = 0, y = 0) {
    /**
     * @type {number}
     * @description x coordinate of vector
     */
    this.x = x;

    /**
     * @type {number}
     * @description y coordinate of vector
     */
    this.y = y;
  }

  /**
   * Add a vector to current vector
   * @param {Vector} vec - vector to add to current vector
   */
  add(vec) {
    this.x += vec.x;
    this.y += vec.y;
  }

  /**
   * Substract vector coodinates from current vector
   * @param {Vector} vec - vector to substract from current vector
   */
  sub(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
  }

  lenSqr() {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Get distance between current vector and another vector
   * @param {Vector} vec - vector to find distance to
   */
  dist(vec) {
    return Math.sqrt(Vector.sub(this, vec).lenSqr());
  }

  /**
   * Get length of the vector
   */
  length() {
    return Math.sqrt(this.lenSqr());
  }

  /**
   * Create a new vector with same coodinates
   */
  copy() {
    return new Vector(this.x, this.y);
  }

  /**
   * Multiply both x and y coordinate by a scalar value
   * @param {number} v scale factor
   * @returns {Vector}
   */
  scale(v) {
    this.x *= v;
    this.y *= v;
    return this;
  }

  /**
   * Create new vector from substraction of two vector
   * @param {Vector} vec1 - first vector
   * @param {Vector} vec2 - second vector
   * @returns {Vector} Vector with coordinates of substraction of two vectors
   */
  static sub(vec1, vec2) {
    return new Vector(vec1.x - vec2.x, vec1.y - vec2.y);
  }
}

export default Vector;
