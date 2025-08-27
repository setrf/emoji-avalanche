const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const engine = Engine.create();
const { world } = engine;

const canvasContainer = document.getElementById('canvas-container');
const width = 400;
const height = 600;

const render = Render.create({
  element: canvasContainer,
  engine: engine,
  options: {
    width,
    height,
    wireframes: false,
    background: '#333'
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Player
const player = Bodies.rectangle(width / 2, height - 100, 20, 50, {
  inertia: Infinity, // To prevent rotation
  render: {
    fillStyle: '#fff'
  }
});
World.add(world, player);

let onGround = false;

// Platforms
const platforms = [];
let platformY = height - 50;

function createPlatform(x, y) {
  const platform = Bodies.rectangle(x, y, 100, 20, {
    isStatic: true,
    render: {
      fillStyle: '#8aa0b8'
    }
  });
  platforms.push(platform);
  World.add(world, platform);
}

// Initial platform
createPlatform(width / 2, platformY);

// Generate more platforms
for (let i = 0; i < 10; i++) {
  platformY -= 100;
  createPlatform(Math.random() * width, platformY);
}

// Controls
const keys = {};
document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

// Game Loop
let score = 0;
let scrollSpeed = 1;

Events.on(engine, 'beforeUpdate', () => {
  // Movement
  if (keys.ArrowLeft) {
    Body.setVelocity(player, { x: -5, y: player.velocity.y });
  }
  if (keys.ArrowRight) {
    Body.setVelocity(player, { x: 5, y: player.velocity.y });
  }
  if (keys.Space && onGround) {
    Body.setVelocity(player, { x: player.velocity.x, y: -12 });
    onGround = false;
  }

  // Scrolling
  platforms.forEach(platform => {
    Body.translate(platform, { x: 0, y: scrollSpeed });
  });

  // Update score
  score += scrollSpeed;
  document.querySelector('h1').textContent = `Icy Tower - Score: ${Math.floor(score)}`;

  // Generate new platforms
  if (platforms[platforms.length - 1].position.y > 0) {
    platformY = platforms[platforms.length - 1].position.y - 100;
    createPlatform(Math.random() * width, platformY);
  }

  // Remove old platforms
  platforms.forEach((platform, index) => {
    if (platform.position.y > height + 50) {
      World.remove(world, platform);
      platforms.splice(index, 1);
    }
  });

  // Game Over
  if (player.position.y > height) {
    alert('Game Over!');
    Engine.clear(engine);
    Render.stop(render);
    Runner.stop(Runner.create());
  }
});

// Collision Detection
Events.on(engine, 'collisionStart', event => {
  const pairs = event.pairs;
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    if (pair.bodyA === player || pair.bodyB === player) {
      onGround = true;
    }
  }
});