# Heax

> Verlet physics engine written in javascript.

## Installation

```bash
npm install heax
```

## Usage

Examples: [https://heax.js.org/examples](https://heax.js.org/examples)

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
  heax.clear();
  heax.update();
  heax.render();
  heax.mouse.drag();

  requireAnimationFrame(update);
})();
```

> For complete api documentation visit [https://heax.js.org](https://heax.js.org)

## Using cdn

```html
<script src="https://unpkg.com/heax"></script>

<script>
  const { Heax, Composite, Particle } = HeaxVerlet;
</script>
```

### License

MIT
