const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const engine = Engine.create();
const { world } = engine;

const canvasContainer = document.getElementById('canvas-container');
const width = canvasContainer.clientWidth;
const height = 500;

const render = Render.create({
  element: canvasContainer,
  engine: engine,
  options: {
    width,
    height,
    wireframes: false,
    background: '#0b0f14'
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Player
const player = Bodies.rectangle(width / 2, height - 50, 50, 50, {
  isStatic: true,
  render: {
    sprite: {
      texture: 'https://emojicdn.elk.sh/😀',
      xScale: 1,
      yScale: 1
    }
  }
});
World.add(world, player);

let playerDirection = 1;

document.getElementById('move-button').addEventListener('click', () => {
  playerDirection *= -1;
});

// Falling Emojis
const emojis = ['😂', '😍', '😭', '🤔', '🔥', '👍', '❤️', '🎉', '💯'];

function createFallingEmoji() {
  const x = Math.random() * width;
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  const body = Bodies.circle(x, -50, 25, {
    restitution: 0.8,
    render: {
      sprite: {
        texture: `https://emojicdn.elk.sh/${emoji}`,
        xScale: 0.5,
        yScale: 0.5
      }
    }
  });
  World.add(world, body);
}

setInterval(createFallingEmoji, 500);

// Game Loop
Events.on(engine, 'beforeUpdate', () => {
  const newX = player.position.x + playerDirection * 5;
  if (newX > 25 && newX < width - 25) {
    Body.setPosition(player, { x: newX, y: player.position.y });
  }
});

// Game Over
Events.on(engine, 'collisionStart', event => {
  const pairs = event.pairs;
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    if (pair.bodyA === player || pair.bodyB === player) {
      alert('Game Over!');
      Engine.clear(engine);
      Render.stop(render);
      Runner.stop(Runner.create());
    }
  }
});
