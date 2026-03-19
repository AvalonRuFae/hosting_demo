// Wait for scene to be loaded
document.addEventListener("DOMContentLoaded", () => {
	const sceneEl = document.querySelector("a-scene");

	// Wait for scene to load
	sceneEl.addEventListener("loaded", () => {
		initializeMuseum();
	});

	// Fallback: also try immediately
	if (sceneEl.hasLoaded) {
		initializeMuseum();
	}
});

function initializeMuseum() {
	// Get references to the camera and buttons
	const camera = document.querySelector("a-entity[camera]");
	const galleryButton = document.getElementById("gallery-button");
	const sculptureButton = document.getElementById("sculpture-button");
	const planetariumButton = document.getElementById("planetarium-button");
	const galleryReturn = document.getElementById("gallery-return");
	const sculptureReturn = document.getElementById("sculpture-return");
	const planetariumReturn = document.getElementById("planetarium-return");

	// Room configurations (position for each room)
	const rooms = {
		entrance: { position: "0 1.6 0" },
		gallery: { position: "30 1.6 0" },
		sculpture: { position: "-30 1.6 0" },
		planetarium: { position: "0 1.6 -30" },
	};

	// Current room tracking
	let currentRoom = "entrance";

	// Function to teleport camera to a room
	function teleportTo(roomKey) {
		const room = rooms[roomKey];
		camera.setAttribute("position", room.position);
		currentRoom = roomKey;
		playTeleportSound();

		console.log(`Teleported to ${roomKey}`);
	}

	// Play teleport sound effect
	function playTeleportSound() {
		const sound = document.getElementById("teleport-sound");
		if (sound) {
			sound.currentTime = 0;
			sound.play().catch((e) => console.log("Sound playback info:", e));
		}
	}

	// Add click listeners to buttons
	if (galleryButton) {
		galleryButton.addEventListener("click", () => {
			teleportTo("gallery");
		});
	}

	if (sculptureButton) {
		sculptureButton.addEventListener("click", () => {
			teleportTo("sculpture");
		});
	}

	if (planetariumButton) {
		planetariumButton.addEventListener("click", () => {
			teleportTo("planetarium");
		});
	}

	if (galleryReturn) {
		galleryReturn.addEventListener("click", () => {
			teleportTo("entrance");
		});
	}

	if (sculptureReturn) {
		sculptureReturn.addEventListener("click", () => {
			teleportTo("entrance");
		});
	}

	if (planetariumReturn) {
		planetariumReturn.addEventListener("click", () => {
			teleportTo("entrance");
		});
	}

	// Optional: Add keyboard navigation
	document.addEventListener("keydown", (event) => {
		switch (event.key) {
			case "1":
				teleportTo("entrance");
				break;
			case "2":
				teleportTo("gallery");
				break;
			case "3":
				teleportTo("sculpture");
				break;
			case "4":
				teleportTo("planetarium");
				break;
		}
	});

	console.log(
		"Museum initialized! Press 1-4 to navigate between rooms, or look at the buttons and click.",
	);
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
