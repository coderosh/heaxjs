# Heax Js

> Verlet physics engine written in javascript.

## Installation

- From npm

```bash
npm install heax
```

- From cdn

```html
<script src="https://cdn.jsdelivr.net/gh/coderosh/heaxjs/dist/bundle.js"></script>
```

## Usage

1. Import Classes

```js
// if you are using npm
import Heax, { Vector, Composite } from "heax";

// if you are using cdn link
const { Heax, Vector, Composite } = window;
```

2. Create a heax instance and pass canvas element to it

```js
const heax = new Heax(document.querySelector("canvas"));
```

3. Create different shapes

```js
// create a box
const box = heax.box(10, 40, 100, 200);

// create a cloth
const cloth = heax.cloth(new Vector(50, 0), 250, 250, 9, 2);

// create a rope
const rope = heax.rope(
  (i) => ({
    x: 100 + i * 5,
    y: 100 + i * 5,
  }),
  20
);

// create custom shape
const square = new Composite(heax);
square.addPoint(100, 100, 100, 100);
square.addPoint(200, 100, 200, 100);
square.addPoint(200, 200, 200, 200);
square.addPoint(100, 200, 100, 200);

square.addStick(0, 1);
square.addStick(1, 2);
square.addStick(2, 3);
square.addStick(3, 0);
square.addStick(1, 2);
square.addStick(0, 3);

heax.composites.push(square);

// join two shapes
square.addStick(square.points[0], rope.points[0]);

// hide all points of a composite
cloth.hidePoints();

// hide all sticks  of a composite
box.hideConsraints();

// hide single point or stick
cloth.points[0].hidden = true;
box.sticks[0].hidden = true;

// pin a point
square.points[2].pinned = true;
```

4. Update and paint the heax instance

```js
function update() {
  heax.update();
  heax.render();

  // drag points with mouse
  heax.mouse.drag();

  requestAnimationFrame(update);
}

update();
```

5. Save and refresh your browser. For complete api documentation visit [coderosh.github.io/heaxjs/docs](https://coderosh.github.io/heaxjs/docs)
