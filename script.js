const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const healthBarFill = document.getElementById("health-bar-fill");
const gameOverScreen = document.getElementById("game-over");
const finalScoreElement = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game State Variables
let player;
let projectiles = [];
let enemies = [];
let particles = [];
let healingItems = [];
let keys = {};
let isGameOver = false;
let score = 0;
let spawnInterval = 1500;
let lastSpawnTime = 0;
let lastHealingSpawnTime = 0;
let animationId;
let upgradeMessage_timer = 0;
let lastHealthPercent = 100;
let lastHealthBarColor = "#00ff00";
const MAX_ENEMIES = 60; // Cap to prevent too many on screen

// Input Management
window.addEventListener("keydown", (e) => (keys[e.code] = true));
window.addEventListener("keyup", (e) => (keys[e.code] = false));

window.addEventListener("mousedown", (e) => {
	if (isGameOver) return;
	const rect = canvas.getBoundingClientRect();
	const mouseX = e.clientX - rect.left;
	const mouseY = e.clientY - rect.top;

	const angle = Math.atan2(mouseY - player.y, mouseX - player.x);

	if (player.gunLevel === 1) {
		projectiles.push(new Projectile(player.x, player.y, angle));
	} else {
		// Gun Level 2+: Triple Shot
		projectiles.push(new Projectile(player.x, player.y, angle));
		projectiles.push(new Projectile(player.x, player.y, angle - 0.2));
		projectiles.push(new Projectile(player.x, player.y, angle + 0.2));
	}
});

restartBtn.addEventListener("click", () => {
	init();
});

class Player {
	constructor() {
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.size = 24;
		this.speed = 5;
		this.color = "#00ff00";
		this.maxHealth = 100;
		this.health = 100;
		this.invincibleFrames = 0;
		this.gunLevel = 1;
	}
	update() {
		if (keys["KeyW"] || keys["ArrowUp"]) this.y -= this.speed;
		if (keys["KeyS"] || keys["ArrowDown"]) this.y += this.speed;
		if (keys["KeyA"] || keys["ArrowLeft"]) this.x -= this.speed;
		if (keys["KeyD"] || keys["ArrowRight"]) this.x += this.speed;

		this.x = Math.max(
			this.size / 2,
			Math.min(canvas.width - this.size / 2, this.x),
		);
		this.y = Math.max(
			this.size / 2,
			Math.min(canvas.height - this.size / 2, this.y),
		);

		// Handle invincibility cooldown
		if (this.invincibleFrames > 0) {
			this.invincibleFrames--;
		}
	}
	takeDamage(amount) {
		if (this.invincibleFrames > 0) return false;

		this.health = Math.max(0, this.health - amount);
		this.invincibleFrames = 60; // 1 second of invincibility at 60fps

		return this.health <= 0;
	}
	draw() {
		// Visual feedback for invincibility (flickering between white and green)
		if (this.invincibleFrames > 0) {
			if (Math.floor(this.invincibleFrames / 5) % 2 === 0) {
				ctx.fillStyle = "#ffffff"; // White flash
			} else {
				ctx.fillStyle = this.color;
			}
		} else {
			ctx.fillStyle = this.color;
		}

		ctx.fillRect(
			this.x - this.size / 2,
			this.y - this.size / 2,
			this.size,
			this.size,
		);
	}
}

class Projectile {
	constructor(x, y, angle) {
		this.x = x;
		this.y = y;
		this.radius = 4;
		this.speed = 10;
		this.color = "#ffff00";
		this.vx = Math.cos(angle) * this.speed;
		this.vy = Math.sin(angle) * this.speed;
	}
	update() {
		this.x += this.vx;
		this.y += this.vy;
	}
	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}

class Enemy {
	constructor(x, y, health = 1) {
		this.x = x;
		this.y = y;
		this.health = health;
		this.maxHealth = health;
		this.flashFrames = 0;

		// Tougher mobs are larger
		this.size = 30 + (this.maxHealth - 1) * 10;

		// Speed logic: health 1 mobs are scouts and move much faster
		if (this.maxHealth === 1) {
			this.speed = 2.5 + Math.random() * 1.0;
		} else {
			// Tougher mobs are slower to compensate for their high health
			this.speed =
				(1.2 + Math.random() * 0.8) / (1 + (this.maxHealth - 1) * 0.15);
		}

		// Color indicator for toughness
		if (this.maxHealth <= 1)
			this.color = "#ff3333"; // Standard red
		else if (this.maxHealth === 2)
			this.color = "#ff8833"; // Tougher orange
		else this.color = "#ff00ff"; // Elite purple
	}

	update(playerX, playerY) {
		const angle = Math.atan2(playerY - this.y, playerX - this.x);
		this.x += Math.cos(angle) * this.speed;
		this.y += Math.sin(angle) * this.speed;
	}

	draw() {
		if (this.flashFrames > 0) {
			ctx.fillStyle = "#ffffff";
			this.flashFrames--;
		} else {
			ctx.fillStyle = this.color;
		}

		ctx.fillRect(
			this.x - this.size / 2,
			this.y - this.size / 2,
			this.size,
			this.size,
		);

		// Retro eye details that scale with mob size
		ctx.fillStyle = "#fff";
		const eyeSize = Math.max(4, this.size * 0.15);
		const eyeOffset = this.size * 0.2;
		ctx.fillRect(
			this.x - eyeOffset - eyeSize / 2,
			this.y - eyeOffset,
			eyeSize,
			eyeSize,
		);
		ctx.fillRect(
			this.x + eyeOffset - eyeSize / 2,
			this.y - eyeOffset,
			eyeSize,
			eyeSize,
		);
	}
}

class HealingItem {
	constructor(x, y, size = 26) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.color = "#D2691E";
	}

	draw() {
		const s = this.size;
		const x = this.x - s / 2;
		const y = this.y - s / 2;

		// Render pixel-art burger layers

		// Top Bun
		ctx.fillStyle = "#D2691E";
		ctx.fillRect(x + s * 0.1, y, s * 0.8, s * 0.3);

		// Lettuce
		ctx.fillStyle = "#00FF00";
		ctx.fillRect(x, y + s * 0.3, s, s * 0.1);

		// Cheese
		ctx.fillStyle = "#FFFF00";
		ctx.fillRect(x + s * 0.05, y + s * 0.4, s * 0.9, s * 0.1);

		// Patty
		ctx.fillStyle = "#4B2D0B";
		ctx.fillRect(x + s * 0.05, y + s * 0.5, s * 0.9, s * 0.25);

		// Bottom Bun
		ctx.fillStyle = "#D2691E";
		ctx.fillRect(x + s * 0.1, y + s * 0.75, s * 0.8, s * 0.2);
	}
}

class Particle {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.size = Math.random() * 3 + 1;
		this.vx = (Math.random() - 0.5) * 6;
		this.vy = (Math.random() - 0.5) * 6;
		this.life = 1.0;
		this.color = color;
	}
	update() {
		this.x += this.vx;
		this.y += this.vy;
		this.life -= 0.02;
	}
	draw() {
		ctx.globalAlpha = this.life;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.size, this.size);
		ctx.globalAlpha = 1.0;
	}
}

function spawnEnemy() {
	// Don't spawn if at max capacity
	if (enemies.length >= MAX_ENEMIES) return;

	const createAtRandomEdge = (h) => {
		let x, y;
		if (Math.random() < 0.5) {
			x = Math.random() < 0.5 ? -30 : canvas.width + 30;
			y = Math.random() * canvas.height;
		} else {
			x = Math.random() * canvas.width;
			y = Math.random() < 0.5 ? -30 : canvas.height + 30;
		}
		if (enemies.length < MAX_ENEMIES) {
			enemies.push(new Enemy(x, y, h));
		}
	};

	// Scaling health based on score: every 5000 points, potential max health increases
	const maxPossibleHealth = Math.floor(score / 5000) + 1;
	const health = Math.floor(Math.random() * maxPossibleHealth) + 1;

	createAtRandomEdge(health);

	// Weak mobs are rolled as 'scouts' and spawn in pairs to swarm the player
	if (health === 1 && enemies.length < MAX_ENEMIES) {
		createAtRandomEdge(health);
	}
}

function spawnHealingItem() {
	const margin = 30;
	const x = Math.random() * (canvas.width - margin * 2) + margin;
	const y = Math.random() * (canvas.height - margin * 2) + margin;
	healingItems.push(new HealingItem(x, y));
}

function init() {
	if (animationId) cancelAnimationFrame(animationId);
	player = new Player();
	projectiles = [];
	enemies = [];
	particles = [];
	healingItems = [];
	score = 0;
	isGameOver = false;
	lastSpawnTime = performance.now();
	lastHealingSpawnTime = performance.now();
	spawnInterval = 1500;
	upgradeMessage_timer = 0;
	lastHealthPercent = 100;
	lastHealthBarColor = "#00ff00";
	scoreElement.innerText = `SCORE: ${score}`;
	if (healthBarFill) healthBarFill.style.width = "100%";
	gameOverScreen.classList.add("hidden");
	gameLoop(performance.now());
}

function checkCollision(obj1, obj2, dist) {
	const dx = obj1.x - obj2.x;
	const dy = obj1.y - obj2.y;
	return Math.sqrt(dx * dx + dy * dy) < dist;
}

function createExplosion(x, y, color) {
	for (let i = 0; i < 8; i++) {
		particles.push(new Particle(x, y, color));
	}
}

function gameLoop(currentTime) {
	if (isGameOver) {
		finalScoreElement.innerText = score;
		gameOverScreen.classList.remove("hidden");
		return;
	}

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Update UI Elements (cached to avoid unnecessary DOM updates)
	if (healthBarFill) {
		const healthPercent = (player.health / player.maxHealth) * 100;
		if (lastHealthPercent !== healthPercent) {
			healthBarFill.style.width = `${healthPercent}%`;
			lastHealthPercent = healthPercent;
		}

		// Change bar color if low health (cached)
		const newColor = healthPercent < 30 ? "#ff0000" : "#00ff00";
		if (lastHealthBarColor !== newColor) {
			healthBarFill.style.backgroundColor = newColor;
			healthBarFill.style.boxShadow =
				newColor === "#ff0000" ? "0 0 10px #ff0000" : "0 0 5px #00ff00";
			lastHealthBarColor = newColor;
		}
	}

	if (currentTime - lastSpawnTime > spawnInterval) {
		spawnEnemy();
		lastSpawnTime = currentTime;
		spawnInterval = Math.max(700, spawnInterval * 0.99);
	}

	if (currentTime - lastHealingSpawnTime > 15000) {
		spawnHealingItem();
		lastHealingSpawnTime = currentTime;
	}

	// Weapon Upgrade Check
	if (score >= 4000 && player.gunLevel === 1) {
		player.gunLevel = 2;
		player.color = "#00ffff";
		upgradeMessage_timer = 120;
	}

	player.update();

	// Handle Healing Items (Drawing and Collection)
	for (let i = healingItems.length - 1; i >= 0; i--) {
		const item = healingItems[i];
		item.draw();

		// Player vs Healing Item collision
		if (checkCollision(player, item, (player.size + item.size) / 2)) {
			// Increase health and clamp to maxHealth (100)
			player.health = Math.min(player.maxHealth, player.health + 30);
			// Visual collection feedback
			createExplosion(item.x, item.y, item.color);
			// Remove collected item
			healingItems.splice(i, 1);
		}
	}

	player.draw();

	// Draw Upgrade Notification
	if (upgradeMessage_timer > 0) {
		ctx.save();
		ctx.fillStyle = "#00ffff";
		ctx.font = "bold 30px Courier New";
		ctx.textAlign = "center";
		ctx.shadowBlur = 10;
		ctx.shadowColor = "#00ffff";
		ctx.fillText(
			"TRIPLE SHOT UNLOCKED!",
			canvas.width / 2,
			canvas.height / 2 - 50,
		);
		ctx.restore();
		upgradeMessage_timer--;
	}

	// Handle Particles
	particles = particles.filter((p) => p.life > 0);
	particles.forEach((p) => {
		p.update();
		p.draw();
	});

	// Handle Projectiles: Use backward loop to cleanup off-screen items efficiently
	for (let i = projectiles.length - 1; i >= 0; i--) {
		const p = projectiles[i];
		p.update();
		p.draw();

		if (
			p.x < -50 ||
			p.x > canvas.width + 50 ||
			p.y < -50 ||
			p.y > canvas.height + 50
		) {
			projectiles.splice(i, 1);
		}
	}

	// Handle Enemies and Collisions
	for (let i = enemies.length - 1; i >= 0; i--) {
		const enemy = enemies[i];
		enemy.update(player.x, player.y);

		// Cull enemies that are far off-screen
		const offscreenDist = 200;
		if (
			enemy.x < -offscreenDist ||
			enemy.x > canvas.width + offscreenDist ||
			enemy.y < -offscreenDist ||
			enemy.y > canvas.height + offscreenDist
		) {
			enemies.splice(i, 1);
			continue;
		}

		enemy.draw();

		if (isGameOver) break;

		// Enemy vs Player
		if (checkCollision(player, enemy, (player.size + enemy.size) / 2)) {
			if (player.takeDamage(20)) {
				isGameOver = true;
				createExplosion(player.x, player.y, player.color);
			} else {
				// Destroy the enemy that hit the player to prevent immediate re-collision
				createExplosion(enemy.x, enemy.y, enemy.color);
				enemies.splice(i, 1);
				continue;
			}
		}

		if (isGameOver) break;

		// Enemy vs Projectiles (with spatial optimization: skip if no projectiles nearby)
		// Use a backwards loop to safely splice projectiles while iterating
		const collisionDist = enemy.size / 2 + 20; // Precompute bounding box for early rejection
		for (let j = projectiles.length - 1; j >= 0; j--) {
			const proj = projectiles[j];
			if (!proj) continue;

			const dx = enemy.x - proj.x;
			const dy = enemy.y - proj.y;
			const distSq = dx * dx + dy * dy; // Use squared distance to avoid sqrt
			const collisionDistSq = collisionDist * collisionDist;

			if (distSq < collisionDistSq) {
				// Only do full collision check if within rough bounding box
				if (checkCollision(enemy, proj, enemy.size / 2 + proj.radius)) {
					// Decrement enemy health and remove projectile immediately from array
					enemy.health--;
					enemy.flashFrames = 3;
					projectiles.splice(j, 1);

					// Only destroy enemy if health is 0
					if (enemy.health <= 0) {
						createExplosion(enemy.x, enemy.y, enemy.color);
						enemies.splice(i, 1);
						// Score bonus based on enemy toughness
						score += 100 * enemy.maxHealth;
						scoreElement.innerText = `SCORE: ${score}`;
						// Exit projectile loop for this enemy as it is now deleted
						break;
					}
				}
			}
		}
	}

	animationId = requestAnimationFrame(gameLoop);
}

init();
