const { Vec2, World, Circle, Box, Polygon } = planck;

const CONFIG = {
  PPM: 100,
  PADDING: 40,
  GRAVITY: Vec2(0, 20),
  STEP: 1 / 60,
  BG_COLOR: '#333',
};

class PhysicsWorld {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.world = new World(CONFIG.GRAVITY);
    this.camera = { y: 0, zoom: 1 };
    this.player = null;
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth - CONFIG.PADDING * 2;
    this.canvas.height = window.innerHeight - CONFIG.PADDING * 2;
    this.ctx.translate(CONFIG.PADDING, CONFIG.PADDING);
    this.worldWidth = this.canvas.width / CONFIG.PPM;
    this.worldHeight = this.canvas.height / CONFIG.PPM;
  }

  addBody(gameObject) {
    if (gameObject.isPlayer) this.player = gameObject.body;
  }

  step() {
    this.world.step(CONFIG.STEP);
  }

  updateCamera() {
    if (!this.player) return;
    const py = this.player.getPosition().y;
    const threshold = this.worldHeight * 0.3;
    const targetY = py > threshold ? py - threshold : 0;
    this.camera.y += (targetY - this.camera.y) * 0.1;
  }

  clear() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = CONFIG.BG_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }

  drawBody(body) {
    const pos = body.getPosition();
    const angle = body.getAngle();
    const shape = body.getFixtureList().getShape();
    this.ctx.fillStyle = body.color || '#000';
    this.ctx.save();
    this.ctx.translate(pos.x * CONFIG.PPM, (pos.y - this.camera.y) * CONFIG.PPM);
    this.ctx.rotate(angle);

    switch (shape.getType()) {
      case 'circle':
        this.ctx.beginPath();
        this.ctx.arc(0, 0, shape.getRadius() * CONFIG.PPM, 0, Math.PI * 2);
        break;
      case 'polygon':
        this.ctx.beginPath();
        shape.m_vertices.forEach((v, i) => {
          const vx = v.x * CONFIG.PPM, vy = v.y * CONFIG.PPM;
          i === 0 ? this.ctx.moveTo(vx, vy) : this.ctx.lineTo(vx, vy);
        });
        this.ctx.closePath();
        break;
    }
    this.ctx.fill();
    this.ctx.restore();
  }

  render() {
    this.step();
    this.updateCamera();
    this.clear();
    let body = this.world.getBodyList();
    while (body) {
      this.drawBody(body);
      body = body.getNext();
    }
    requestAnimationFrame(() => this.render());
  }
}

class GameObject {
  constructor(world, { type, xRatio, yRatio, width, height, radius, color, angle = 0, dynamic = false, isPlayer = false }) {
    this.world = world;
    this.isPlayer = isPlayer;
    const x = xRatio * world.worldWidth;
    const y = yRatio * world.worldHeight;

    this.body = world.world.createBody({
      type: dynamic ? 'dynamic' : 'static',
      position: Vec2(x, y),
      angle
    });

    let shape;
    if (type === 'circle') shape = Circle(radius);
    else if (type === 'box') shape = Box(width / 2, height / 2);
    else if (type === 'triangle') shape = Polygon([
      Vec2(0, -height / 2),
      Vec2(-width / 2, height / 2),
      Vec2(width / 2, height / 2)
    ]);

    this.body.createFixture(shape, { density: dynamic ? 1 : 0, restitution: 0.3 });
    this.body.color = color;
    world.addBody(this);
  }
}

// 初始化游戏
const game = new PhysicsWorld('canvas');

// 添加对象
new GameObject(game, { type: 'box', xRatio: 0, yRatio: 0, width: 10, height: 100, color: '#000' });
new GameObject(game, { type: 'box', xRatio: 1, yRatio: 0, width: 10, height: 100, color: '#000' });
new GameObject(game, { type: 'box', xRatio: 0.5, yRatio: 1, width: 2, height: 2, color: '#0f0' });
new GameObject(game, { type: 'triangle', xRatio: 0.4, yRatio: 0.6, width: 2, height: 5.5, color: '#111', angle: 0.12 });
new GameObject(game, { type: 'circle', xRatio: 0.25, yRatio: 0.1, radius: 1.1, color: '#c00', dynamic: true, isPlayer: true });

game.render();