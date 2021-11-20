# Heax

> Verlet physics engine written in javascript.

## Installation

```bash
npm install heax
```

## Usage

Examples: [https://coderosh.github.io/heaxjs/examples](https://coderosh.github.io/heaxjs/examples)

```js
import { Heax, Composite } from "heax";

const canvas = document.querySelector("canvas");

const heax = new Heax(canvas);

heax.createRope();
heax.createRectangle();

// create custom shape
const square = new Composite(heax);
square.addParticle(100, 100, 100, 100);
square.addParticle(200, 100, 200, 100);
square.addParticle(200, 200, 200, 200);
square.addParticle(100, 200, 100, 200);

square.addConstraint(0, 1);
square.addConstraint(1, 2);
square.addConstraint(2, 3);
square.addConstraint(3, 0);
square.addConstraint(1, 2);
square.addConstraint(0, 3);

heax.composites.push(square);

(function update() {
  heax.update();
  heax.render();
  heax.mouse.drag();
  heax.clear();

  requireAnimationFrame(update);
})();
```

> For complete api documentation visit [https://coderosh.github.io/heaxjs](https://coderosh.github.io/heaxjs)
