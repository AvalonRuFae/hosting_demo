const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const healthEl = document.getElementById("health");
const moneyEl = document.getElementById("money");
const waveEl = document.getElementById("wave");
const nextWaveBtn = document.getElementById("next-wave-btn");
const gameOverOverlay = document.getElementById("game-over");
const finalWaveEl = document.getElementById("final-wave");

// Shop DOM Elements
const shopSlotsEl = document.getElementById("shop-slots");
const rerollBtn = document.getElementById("reroll-btn");

// Unit Info DOM Elements
const unitInfoEl = document.getElementById("unit-info");
const infoNameEl = document.getElementById("info-name");
const infoRarityEl = document.getElementById("info-rarity");
const infoCategoryEl = document.getElementById("info-category");
const infoCostEl = document.getElementById("info-cost");
const infoDamageEl = document.getElementById("info-damage");
const infoDpsEl = document.getElementById("info-dps");
const infoRangeEl = document.getElementById("info-range");
const infoCooldownEl = document.getElementById("info-cooldown");
const infoAbilitiesEl = document.getElementById("info-abilities");
const infoDescriptionEl = document.getElementById("info-description");
const sellTowerBtn = document.getElementById("sell-tower-btn");

// Game Constants
const gridSize = 40;
const unitLimit = 20;
const incomeUnitLimit = 5;
const towerConfig = {
	"tower-basic": {
		cost: 20,
		color: "#f1c40f",
		range: 200,
		damage: 10,
		fireRate: 30,
		name: "Basic",
		rarity: "Common",
		category: "Basic",
		description: "A reliable unit providing consistent single-target damage.",
	},
	"tower-grass": {
		cost: 30,
		color: "#2ecc71",
		range: 50,
		damage: 30,
		fireRate: 120,
		name: "Grass",
		rarity: "Common",
		category: "Basic",
		description:
			"Deals heavy damage but has a very short range and slow fire rate.",
	},
	"tower-ice": {
		cost: 35,
		color: "#3498db",
		range: 100,
		damage: 50,
		fireRate: 180,
		name: "Ice",
		rarity: "Common",
		category: "Slower",
		slow: 0.1,
		aoe: true,
		aoeRange: 60,
		description:
			"Slows down groups of enemies with chilling area-of-effect blasts.",
	},
	"tower-natural": {
		cost: 20,
		color: "#e67e22",
		range: 200,
		damage: 5,
		fireRate: 12,
		name: "Natural",
		rarity: "Common",
		category: "Basic",
		trapChance: 0.1,
		trapDuration: 150,
		description: "Rapid-fire unit with a chance to momentarily stun enemies.",
	},
	// Uncommon Units
	"tower-carrot": {
		cost: 40,
		color: "#ff7f50",
		range: 0,
		damage: 0,
		fireRate: 0,
		name: "Carrot Farmer",
		rarity: "Uncommon",
		category: "Income",
		income: 100,
		description:
			"Provides a significant boost to your economy at the end of every wave.",
	},
	"tower-flame": {
		cost: 40,
		color: "#ff4500",
		range: 75,
		damage: 60,
		fireRate: 48,
		name: "Flame",
		rarity: "Uncommon",
		category: "Damage Dealer",
		aoe: true,
		aoeRange: 60,
		dotDamage: 3,
		dotDuration: 300,
		description:
			"Incinerates enemies with area damage and a lingering burn effect.",
	},
	"tower-clock": {
		cost: 40,
		color: "#95a5a6",
		range: 70,
		damage: 80,
		fireRate: 54,
		name: "Clock Tower",
		rarity: "Uncommon",
		category: "Damage Dealer",
		barrierHp: 500,
		barrierInterval: 600,
		description:
			"Deals high damage and periodically deploys sturdy barriers on the path.",
	},
	// Rare Units
	"tower-foreign": {
		cost: 65,
		color: "#3498db",
		range: 90,
		damage: 3,
		fireRate: 0.6,
		name: "Foreign",
		rarity: "Rare",
		category: "Damage Dealer",
		barrierHp: 100,
		barrierInterval: 1200,
		aoe: true,
		aoeRange: 80,
		description:
			"A versatile attacker that hits multiple targets and creates barriers.",
	},
	"tower-dog-keeper": {
		cost: 200,
		color: "#8d6e63",
		range: 0,
		damage: 0,
		fireRate: 0,
		name: "Dog Keeper",
		rarity: "Rare",
		category: "Income",
		income: 30,
		incomeInterval: 300,
		description: "Generates steady passive income throughout the wave.",
	},
	"tower-shark": {
		cost: 250,
		color: "#34495e",
		range: 60,
		damage: 30,
		fireRate: 60,
		name: "Shark Tower",
		rarity: "Rare",
		category: "Multitasker",
		income: 30,
		incomeInterval: 900,
		dotDamage: 10,
		dotDuration: 600,
		description:
			'A true multitasker: provides solid damage, inflicts <span class="highlight-bleed">bleed</span> status, and generates passive income.',
	},
	"tower-weapon": {
		cost: 250,
		color: "#ffffff",
		range: 300,
		damage: 3,
		fireRate: 27,
		name: "White Tower",
		rarity: "Rare",
		category: "Damage Dealer",
		aoe: true,
		aoeRange: 200,
		description:
			"A high-precision unit with exceptional range and powerful area damage capabilities.",
	},
	// Epic Units
	"tower-megaphone": {
		cost: 300,
		color: "#9b59b6",
		range: 85,
		damage: 200,
		fireRate: 72,
		name: "Megaphone",
		rarity: "Epic",
		category: "Multitasker",
		boostRange: 250,
		boostAmount: 0.1,
		aoe: true,
		aoeRange: 50,
		description:
			"Blasts high-volume motivation! Deals strong splash damage and provides a 10% damage boost to nearby towers within a 250px range.",
	},
	// Legendary Units
	"tower-droneship": {
		cost: 500,
		color: "#f1c40f",
		range: 90,
		damage: 15,
		fireRate: 9,
		name: "Camera Droneship",
		rarity: "Legendary",
		category: "Multitasker",
		spawnDrone: true,
		aoe: true,
		aoeRange: 50,
		description:
			"A mobile command center that fires splash damage rounds and deploys automated drones to intercept enemies. Every 10 seconds, it launches a drone with 50 HP and high impact damage.",
	},
	// Mythical Units
	"tower-void": {
		cost: 2500,
		color: "#ff00ff",
		range: 125,
		damage: 200,
		fireRate: 9, // 0.15s
		name: "Void Tower",
		rarity: "Mythical",
		category: "Multitasker",
		aoe: true,
		aoeRange: 120,
		blackholeInterval: 600, // 10s
		blackholeDuration: 300, // 5s
		blackholeDamage: 100, // per second
		blackholeRadius: 30,
		voidBarrierHp: 100,
		voidBarrierAoe: 70,
		spawnSatellite: true,
		satelliteDamage: 75,
		satelliteCd: 12, // 0.2s
		satelliteRange: 50,
		description:
			"An absolute unit of mythical power. Deploys crushing black holes, void-infused barriers, and automated satellites to intercept spawns.",
	},
};

/** Helper to generate descriptive strings for unit abilities */
function getUnitAbilities(config) {
	const abilities = [];
	if (config.slow) abilities.push(`Slow: ${Math.round(config.slow * 100)}%`);
	if (config.aoe) abilities.push(`AOE: ${config.aoeRange}px radius`);
	if (config.trapChance)
		abilities.push(`Stun: ${Math.round(config.trapChance * 100)}% chance`);
	if (config.income) {
		if (config.incomeInterval) {
			abilities.push(
				`Income: $${config.income} / ${config.incomeInterval / 60}s`,
			);
		} else {
			abilities.push(`Income: $${config.income} / wave`);
		}
	}
	if (config.dotDamage) {
		const effectName = config.name === "Flame" ? "Burn" : "Bleed";
		abilities.push(
			`${effectName}: ${config.dotDamage} DPS (${config.dotDuration / 60}s)`,
		);
	}
	if (config.barrierHp) {
		const intervalSeconds = (config.barrierInterval || 600) / 60;
		abilities.push(`Barriers: ${config.barrierHp} HP / ${intervalSeconds}s`);
	}
	if (config.boostAmount) {
		abilities.push(
			`Boost: +${Math.round(config.boostAmount * 100)}% Damage (${config.boostRange}px radius)`,
		);
	}
	if (config.spawnDrone) {
		abilities.push(`Drones: 50 Dmg, 0.25s CD, 50 HP (Spawns every 10s)`);
	}
	if (config.blackholeInterval) {
		abilities.push(`Blackhole: 100 Dmg/s, Trap 3, 5s duration / 10s`);
	}
	if (config.spawnSatellite) {
		abilities.push(`Satellites: 75 Dmg, 0.2s CD, Moves to spawn`);
	}
	return abilities;
}

const rarityConfig = {
	Common: { weight: 0.8, color: "#bdc3c7" },
	Uncommon: { weight: 0.15, color: "#1abc9c" },
	Rare: { weight: 0.03, color: "#3498db" },
	Epic: { weight: 0.01, color: "#9b59b6" },
	Legendary: { weight: 0.0099, color: "#f1c40f" },
	Mythical: { weight: 0.0001, color: "#ff00ff" },
};

const difficultyConfig = {
	easy: {
		health: 40,
		money: 200,
		waveBonus: 40,
		enemyStatMultiplier: 0.8,
		enemySpeed: 175.5 / 60,
		maxWaves: 20,
	},
	"kinda-easy": {
		health: 30,
		money: 150,
		waveBonus: 30,
		enemyStatMultiplier: 1.0,
		enemySpeed: 150 / 60,
		maxWaves: 30,
	},
	"maybe-hard": {
		health: 20,
		money: 100,
		waveBonus: 20,
		enemyStatMultiplier: 1.25,
		enemySpeed: 130 / 60,
		maxWaves: 35,
	},
	hard: {
		health: 15,
		money: 75,
		waveBonus: 15,
		enemyStatMultiplier: 1.6,
		enemySpeed: 100 / 60,
		maxWaves: 40,
	},
	deadly: {
		health: 5,
		money: 50,
		waveBonus: 10,
		enemyStatMultiplier: 2.2,
		enemySpeed: 72.5 / 60,
		maxWaves: 60,
	},
};

// Map Path configurations per difficulty
const difficultyPaths = {
	easy: [
		{ x: -50, y: 100 },
		{ x: 700, y: 100 },
		{ x: 700, y: 200 },
		{ x: 100, y: 200 },
		{ x: 100, y: 300 },
		{ x: 700, y: 300 },
		{ x: 700, y: 400 },
		{ x: 100, y: 400 },
		{ x: 100, y: 500 },
		{ x: 850, y: 500 },
	],
	"kinda-easy": [
		{ x: -50, y: 100 },
		{ x: 700, y: 100 },
		{ x: 700, y: 300 },
		{ x: 100, y: 300 },
		{ x: 100, y: 500 },
		{ x: 850, y: 500 },
	],
	"maybe-hard": [
		{ x: -50, y: 100 },
		{ x: 700, y: 500 },
		{ x: 100, y: 500 },
		{ x: 850, y: 100 },
	],
	hard: [
		{ x: 400, y: -50 },
		{ x: 400, y: 300 },
		{ x: 850, y: 300 },
	],
	deadly: [
		{ x: -50, y: 300 },
		{ x: 850, y: 300 },
	],
};

// Game State
let health = 20;
let money = 100;
let wave = 0;
let currentMaxWaves = 0;
let currentWaveBonus = 20;
let currentEnemyMultiplier = 1.0;
let currentEnemySpeed = 1.0;
let gameSpeed = 1;
let path = []; // Set dynamically in startGame
let enemies = [];
let towers = [];
let projectiles = [];
let barriers = [];
let drones = [];
let blackholes = [];
let satellites = [];
let isWaveActive = false;
let isGameOver = false;
let spawnTimer = 0;
let spawnDelay = 0;
let selectedTowerType = null;
let selectedTower = null;
let mousePos = { x: 0, y: 0 };
let enemySpawnedInWave = 0;
let totalEnemiesInWave = 0;

// Index Page state
let indexPage = 0;

// Shop State
let shopTowers = [];
let selectedShopIndex = -1;
const rerollCost = 10;

function renderTowerIndex() {
	const indexEl = document.getElementById("tower-index");
	const contentEl = document.getElementById("index-content");
	const pageInfoEl = document.getElementById("index-page-info");
	if (!indexEl || !contentEl) return;

	const towerKeys = Object.keys(towerConfig);
	const totalPages = towerKeys.length;

	indexPage = Math.max(0, Math.min(indexPage, totalPages - 1));

	contentEl.innerHTML = "<h3>Field Guide</h3>";

	if (totalPages === 0) {
		if (pageInfoEl) pageInfoEl.textContent = "Page 0 / 0";
		return;
	}

	const key = towerKeys[indexPage];
	const config = towerConfig[key];

	const abilities = getUnitAbilities(config);

	const cdText =
		config.fireRate > 0 ? (config.fireRate / 60).toFixed(3) + "s" : "N/A";
	const dps =
		config.fireRate > 0
			? (config.damage / (config.fireRate / 60)).toFixed(1)
			: 0;

	const rarityWeight = rarityConfig[config.rarity]?.weight || 0;
	const rarityPercent = (rarityWeight * 100).toFixed(2) + "%";

	const item = document.createElement("div");
	item.className = "index-item";
	item.innerHTML = `
        <span class="index-item-name">${config.name}</span>
        <div style="margin: 10px 0; padding: 5px; border: 1px solid #5d4037; background: rgba(0,0,0,0.05); text-align: center;">
            <span style="font-weight: bold; color: #5d4037;">${config.rarity} Unit (${rarityPercent})</span>
        </div>
        <p style="margin: 10px 0; font-style: italic; color: #5d4037; line-height: 1.4; border-bottom: 1px dashed rgba(93,64,55,0.2); padding-bottom: 10px;">
            ${config.description}
        </p>
        <span class="index-item-stats">
            <strong>Category:</strong> ${config.category}<br>
            <strong>Cost:</strong> $${config.cost}<br>
            <strong>Damage:</strong> ${config.damage}<br>
            <strong>DPS:</strong> ${dps}<br>
            <strong>Range:</strong> ${config.range}px<br>
            <strong>Cooldown:</strong> ${cdText}
        </span>
        <div style="margin-top: 15px;">
            <span class="index-item-abilities">
                <strong>Abilities:</strong><br>
                ${abilities.length > 0 ? abilities.join("<br>") : "None"}
            </span>
        </div>
    `;
	contentEl.appendChild(item);

	if (pageInfoEl) {
		pageInfoEl.textContent = `Page ${indexPage + 1} / ${totalPages}`;
	}
}

function updateTowerInfo() {
	if (selectedTower) {
		const config = towerConfig[selectedTower.type];
		infoNameEl.textContent = config.name;

		const rarityWeight = rarityConfig[config.rarity]?.weight || 0;
		const rarityPercent = (rarityWeight * 100).toFixed(2) + "%";
		infoRarityEl.textContent = `${config.rarity} (${rarityPercent})`;

		if (infoCategoryEl) infoCategoryEl.textContent = config.category;

		if (infoCostEl) infoCostEl.textContent = config.cost;

		// Calculate Boost details
		let maxBoost = 0;
		towers.forEach((other) => {
			if (other === selectedTower) return;
			const otherConfig = towerConfig[other.type];
			if (otherConfig.boostRange) {
				const dist = Math.sqrt(
					(other.x - selectedTower.x) ** 2 + (other.y - selectedTower.y) ** 2,
				);
				if (dist <= otherConfig.boostRange) {
					maxBoost = Math.max(maxBoost, otherConfig.boostAmount || 0);
				}
			}
		});

		const boostSuffix =
			maxBoost > 0 ? ` (Enhanced by ${Math.round(maxBoost * 100)}%)` : "";

		infoDamageEl.textContent = config.damage + boostSuffix;
		const dps =
			config.fireRate > 0
				? (config.damage / (config.fireRate / 60)).toFixed(1)
				: 0;
		if (infoDpsEl) infoDpsEl.textContent = dps + boostSuffix;

		infoRangeEl.textContent = config.range;
		infoCooldownEl.textContent =
			config.fireRate > 0 ? (config.fireRate / 60).toFixed(3) + "s" : "N/A";

		const abilities = getUnitAbilities(config);
		infoAbilitiesEl.textContent =
			abilities.length > 0 ? abilities.join(", ") : "None";

		if (infoDescriptionEl) infoDescriptionEl.textContent = config.description;

		// Sell Button Logic
		if (sellTowerBtn) {
			const sellPrice = Math.floor(config.cost * 0.7);
			sellTowerBtn.textContent = `Sell ($${sellPrice})`;
			sellTowerBtn.classList.remove("hidden");
		}

		unitInfoEl.classList.remove("hidden");
	} else {
		unitInfoEl.classList.add("hidden");
		if (sellTowerBtn) sellTowerBtn.classList.add("hidden");
	}
}

function renderShop() {
	if (!shopSlotsEl) return;
	shopSlotsEl.innerHTML = "";
	shopTowers.forEach((type, index) => {
		if (!type) return;
		const config = towerConfig[type];
		const btn = document.createElement("button");
		btn.className = "tower-option";
		if (selectedTowerType === type && selectedShopIndex === index) {
			btn.classList.add("selected");
		}
		btn.textContent = `${config.name} ($${config.cost})`;
		// Color coding by rarity
		const rarityColor = rarityConfig[config.rarity]?.color || "#555";
		btn.style.borderLeft = `5px solid ${rarityColor}`;

		btn.onclick = () => {
			if (isGameOver) return;
			selectedTower = null;
			if (selectedTowerType === type && selectedShopIndex === index) {
				selectedTowerType = null;
				selectedShopIndex = -1;
			} else {
				selectedTowerType = type;
				selectedShopIndex = index;
			}
			updateUI();
		};
		shopSlotsEl.appendChild(btn);
	});
}

function updateUI() {
	healthEl.textContent = Math.max(0, health);
	moneyEl.textContent = Math.floor(money);
	waveEl.textContent = wave;
	const unitCountEl = document.getElementById("unit-count");
	if (unitCountEl) unitCountEl.textContent = towers.length;
	nextWaveBtn.disabled = isWaveActive;

	if (rerollBtn) {
		rerollBtn.disabled = money < rerollCost;
	}

	renderShop();
	updateTowerInfo();
}

function refreshShop() {
	shopTowers = [];
	const rarityKeys = Object.keys(rarityConfig);

	for (let i = 0; i < 3; i++) {
		const rand = Math.random();
		let selectedRarity = "Common";
		let cumulativeWeight = 0;

		for (const rKey of rarityKeys) {
			cumulativeWeight += rarityConfig[rKey].weight;
			if (rand <= cumulativeWeight) {
				selectedRarity = rKey;
				break;
			}
		}

		const pool = Object.keys(towerConfig).filter(
			(tKey) => towerConfig[tKey].rarity === selectedRarity,
		);
		if (pool.length > 0) {
			const randomType = pool[Math.floor(Math.random() * pool.length)];
			shopTowers.push(randomType);
		} else {
			const commonPool = Object.keys(towerConfig).filter(
				(tKey) => towerConfig[tKey].rarity === "Common",
			);
			shopTowers.push(
				commonPool[Math.floor(Math.random() * commonPool.length)],
			);
		}
	}
	renderShop();
}

function startGame(difficulty) {
	const config = difficultyConfig[difficulty];
	health = config.health;
	money = config.money;
	currentWaveBonus = config.waveBonus;
	currentEnemyMultiplier = config.enemyStatMultiplier;
	currentEnemySpeed = config.enemySpeed;
	currentMaxWaves = config.maxWaves;
	wave = 0;
	path = difficultyPaths[difficulty];

	// Clear previous game state
	towers = [];
	enemies = [];
	projectiles = [];
	barriers = [];
	drones = [];
	blackholes = [];
	satellites = [];
	isWaveActive = false;
	isGameOver = false;

	document.getElementById("start-screen").classList.add("hidden");
	document.getElementById("side-panel").classList.remove("hidden");
	renderTowerIndex();
	refreshShop();
	updateUI();
}

function getRandomPathPoint() {
	if (!path || path.length < 2) return { x: 400, y: 300 };
	const segIdx = Math.floor(Math.random() * (path.length - 1));
	const p1 = path[segIdx];
	const p2 = path[segIdx + 1];
	const t = Math.random();
	return {
		x: p1.x + (p2.x - p1.x) * t,
		y: p1.y + (p2.y - p1.y) * t,
	};
}

class Barrier {
	constructor(x, y, health, color) {
		this.x = x;
		this.y = y;
		this.health = health;
		this.color = color;
		this.radius = 20;
		this.dead = false;
	}

	draw() {
		ctx.save();
		ctx.fillStyle = this.color || "rgba(149, 165, 166, 0.8)";
		ctx.strokeStyle = "#2c3e50";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();

		// Barrier health above it
		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 12px Arial";
		ctx.textAlign = "center";
		ctx.fillText(Math.ceil(this.health), this.x, this.y - this.radius - 5);
		ctx.restore();
	}
}

class Enemy {
	constructor(health, speed, color, bounty, damage = 1) {
		this.x = path[0].x;
		this.y = path[0].y;
		this.health = health;
		this.maxHealth = health;
		this.speed = speed;
		this.color = color;
		this.bounty = bounty;
		this.damage = damage;
		this.waypointIndex = 0;
		this.radius = 15;
		this.speedMultiplier = 1.0;
		this.stunTimer = 0;
		this.slowTimer = 0;
		this.dots = [];
	}

	update() {
		for (let i = this.dots.length - 1; i >= 0; i--) {
			const dot = this.dots[i];
			this.health -= dot.damage;
			dot.timer--;
			if (dot.timer <= 0) {
				this.dots.splice(i, 1);
			}
		}

		if (this.stunTimer > 0) {
			this.stunTimer--;
			return true;
		}

		if (this.slowTimer > 0) {
			this.slowTimer--;
			if (this.slowTimer <= 0) {
				this.speedMultiplier = 1.0;
			}
		}

		for (const barrier of barriers) {
			const dx = barrier.x - this.x;
			const dy = barrier.y - this.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < this.radius + barrier.radius) {
				barrier.health -= 2;
				if (barrier.health <= 0) barrier.dead = true;
				return true;
			}
		}

		const target = path[this.waypointIndex + 1];
		if (!target) return false;

		const effectiveSpeed = this.speed * this.speedMultiplier;
		const dx = target.x - this.x;
		const dy = target.y - this.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < effectiveSpeed) {
			this.waypointIndex++;
			if (this.waypointIndex >= path.length - 1) return false;
		} else {
			this.x += (dx / distance) * effectiveSpeed;
			this.y += (dy / distance) * effectiveSpeed;
		}
		return true;
	}

	draw() {
		const barY = this.y - this.radius - 10;
		const textY = barY - 5;

		// Status effects visuals
		if (this.dots.length > 0) {
			ctx.fillStyle = "rgba(255, 69, 0, 0.4)";
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
			ctx.fill();
		}
		if (this.stunTimer > 0) {
			ctx.strokeStyle = "#f1c40f";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(this.x - this.radius, this.y - 5);
			ctx.lineTo(this.x + this.radius, this.y - 5);
			ctx.moveTo(this.x - this.radius, this.y + 5);
			ctx.lineTo(this.x + this.radius, this.y + 5);
			ctx.stroke();
		}

		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 12px Arial";
		ctx.textAlign = "center";
		ctx.fillText(Math.ceil(this.health), this.x, textY);
		ctx.fillStyle = "#666";
		ctx.fillRect(this.x - 15, barY, 30, 5);
		ctx.fillStyle = "#00ff00";
		ctx.fillRect(this.x - 15, barY, 30 * (this.health / this.maxHealth), 5);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 1;
		ctx.strokeRect(this.x - 15, barY, 30, 5);
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.strokeStyle = "white";
		ctx.stroke();

		ctx.closePath();
	}
}

class Projectile {
	constructor(x, y, target, damage, color, type) {
		this.x = x;
		this.y = y;
		this.target = target;
		this.damage = damage;
		this.color = color;
		this.type = type;
		this.speed = 8;
		this.radius = 4;
		this.dead = false;
	}

	update() {
		if (!enemies.includes(this.target)) {
			this.dead = true;
			return;
		}

		const dx = this.target.x - this.x;
		const dy = this.target.y - this.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < this.speed) {
			const config = towerConfig[this.type];
			if (config && config.aoe) {
				const aoeRange = config.aoeRange || 0;
				const impactX = this.target.x;
				const impactY = this.target.y;
				enemies.forEach((enemy) => {
					const distToImpact = Math.sqrt(
						(enemy.x - impactX) ** 2 + (enemy.y - impactY) ** 2,
					);
					if (distToImpact <= aoeRange) {
						this.applyImpact(enemy, config);
					}
				});
			} else if (config) {
				this.applyImpact(this.target, config);
			}
			this.dead = true;
		} else {
			this.x += (dx / distance) * this.speed;
			this.y += (dy / distance) * this.speed;
		}
	}

	applyImpact(enemy, config) {
		enemy.health -= this.damage;
		if (config.slow) {
			enemy.speedMultiplier = 1.0 - config.slow;
			enemy.slowTimer = 60;
		}
		if (config.trapChance && Math.random() < config.trapChance) {
			enemy.stunTimer = config.trapDuration || 150;
		}
		if (config.dotDamage) {
			enemy.dots.push({
				damage: config.dotDamage / 60,
				timer: config.dotDuration,
			});
		}
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}
}

class Drone {
	constructor(x, y, damage = 50, health = 50) {
		this.x = x;
		this.y = y;
		this.damage = damage;
		this.health = health;
		this.maxHealth = health;
		this.fireRate = 15; // 0.25s at 60fps
		this.cooldown = 0;
		this.radius = 12;
		this.speed = 2;
		this.dead = false;

		// Find the nearest waypoint to start moving along the path
		let nearestIdx = 0;
		let minDist = Infinity;
		if (path && path.length > 0) {
			for (let i = 0; i < path.length; i++) {
				const d = Math.sqrt((path[i].x - x) ** 2 + (path[i].y - y) ** 2);
				if (d < minDist) {
					minDist = d;
					nearestIdx = i;
				}
			}
		}
		this.waypointIndex = nearestIdx;
	}

	update() {
		if (this.health <= 0) {
			this.dead = true;
			return;
		}

		const target = path[this.waypointIndex];
		if (!target) {
			this.dead = true;
			return;
		}

		const dx = target.x - this.x;
		const dy = target.y - this.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		const moveAngle = Math.atan2(dy, dx);

		if (distance < this.speed) {
			this.waypointIndex--;
			if (this.waypointIndex < 0) {
				this.dead = true;
				return;
			}
		} else {
			this.x += Math.cos(moveAngle) * this.speed;
			this.y += Math.sin(moveAngle) * this.speed;
		}

		if (this.cooldown > 0) this.cooldown--;

		// Interaction logic
		const sensorDist = 20;
		const sensorX = this.x + Math.cos(moveAngle) * sensorDist;
		const sensorY = this.y + Math.sin(moveAngle) * sensorDist;

		for (let i = enemies.length - 1; i >= 0; i--) {
			const enemy = enemies[i];
			const distToEnemy = Math.sqrt(
				(enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2,
			);

			// Crash logic: if touching enemy
			if (distToEnemy < this.radius + enemy.radius) {
				enemy.health -= this.damage;
				this.health = 0;
				this.dead = true;
				return;
			}

			// frontal proximity attack logic
			if (this.cooldown <= 0) {
				const distToSensor = Math.sqrt(
					(enemy.x - sensorX) ** 2 + (enemy.y - sensorY) ** 2,
				);
				if (distToSensor < enemy.radius + 10) {
					enemy.health -= this.damage;
					this.cooldown = this.fireRate;
				}
			}
		}
	}

	draw() {
		ctx.save();
		ctx.translate(this.x, this.y);
		// Simple visuals for drone
		ctx.fillStyle = "#f1c40f";
		ctx.strokeStyle = "#333";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();

		// Propellers
		ctx.beginPath();
		ctx.moveTo(-10, -10);
		ctx.lineTo(-6, -6);
		ctx.moveTo(10, -10);
		ctx.lineTo(6, -6);
		ctx.stroke();

		ctx.restore();

		// Health bar
		const barWidth = 24;
		ctx.fillStyle = "#666";
		ctx.fillRect(this.x - barWidth / 2, this.y - 18, barWidth, 4);
		ctx.fillStyle = "#00ff00";
		ctx.fillRect(
			this.x - barWidth / 2,
			this.y - 18,
			barWidth * (this.health / this.maxHealth),
			4,
		);
	}
}

class Blackhole {
	constructor(x, y, duration, damage, radius) {
		this.x = x;
		this.y = y;
		this.duration = duration;
		this.damage = damage / 60;
		this.radius = radius;
		this.dead = false;
	}

	update() {
		this.duration--;
		if (this.duration <= 0) {
			this.dead = true;
			return;
		}

		let trappedCount = 0;
		enemies.forEach((enemy) => {
			const dist = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
			if (dist <= this.radius) {
				enemy.health -= this.damage;
				if (trappedCount < 3) {
					enemy.stunTimer = 2; // Keep stunned while in hole
					trappedCount++;
				}
			}
		});
	}

	draw() {
		ctx.save();
		const grad = ctx.createRadialGradient(
			this.x,
			this.y,
			0,
			this.x,
			this.y,
			this.radius,
		);
		grad.addColorStop(0, "rgba(0, 0, 0, 1)");
		grad.addColorStop(0.6, "rgba(100, 0, 150, 0.8)");
		grad.addColorStop(1, "rgba(0, 0, 0, 0)");

		ctx.fillStyle = grad;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}
}

class Satellite extends Drone {
	constructor(x, y, damage = 75, fireRate = 12, range = 50) {
		super(x, y, damage, 100);
		this.damage = damage;
		this.fireRate = fireRate;
		this.range = range;
		this.speed = 3;
		this.radius = 10;
	}

	update() {
		if (this.health <= 0) {
			this.dead = true;
			return;
		}

		const target = path[this.waypointIndex];
		if (!target) {
			this.dead = true;
			return;
		}

		const dx = target.x - this.x;
		const dy = target.y - this.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		const moveAngle = Math.atan2(dy, dx);

		if (distance < this.speed) {
			this.waypointIndex--;
			if (this.waypointIndex < 0) {
				this.dead = true;
				return;
			}
		} else {
			this.x += Math.cos(moveAngle) * this.speed;
			this.y += Math.sin(moveAngle) * this.speed;
		}

		if (this.cooldown > 0) this.cooldown--;

		if (this.cooldown <= 0) {
			for (let i = enemies.length - 1; i >= 0; i--) {
				const enemy = enemies[i];
				const distToEnemy = Math.sqrt(
					(enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2,
				);
				if (distToEnemy <= this.range) {
					enemy.health -= this.damage;
					this.cooldown = this.fireRate;
					break;
				}
			}
		}

		for (let i = enemies.length - 1; i >= 0; i--) {
			const enemy = enemies[i];
			const distToEnemy = Math.sqrt(
				(enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2,
			);
			if (distToEnemy < this.radius + enemy.radius) {
				enemy.health -= this.damage * 2;
				this.health = 0;
				this.dead = true;
				return;
			}
		}
	}

	draw() {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.fillStyle = "#ff00ff";
		ctx.strokeStyle = "#fff";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.rect(-8, -8, 16, 16);
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = "#3498db";
		ctx.fillRect(-15, -3, 7, 6);
		ctx.fillRect(8, -3, 7, 6);
		ctx.restore();
	}
}

class Tower {
	constructor(x, y, type) {
		this.x = x;
		this.y = y;
		this.type = type;
		this.range = towerConfig[type].range;
		this.color = towerConfig[type].color;
		this.damage = towerConfig[type].damage;
		this.fireRate = towerConfig[type].fireRate;
		this.cooldown = 0;
		this.angle = 0;
		this.barrierTimer = 0;
		this.incomeTimer = 0;
		this.droneTimer = 0;
		this.blackholeTimer = 0;
		this.voidBarrierTimer = 0;
		this.satelliteTimer = 0;
		this.myBarriers = [];
	}

	findTarget(enemies) {
		let bestEnemy = null;
		let furthestWaypoint = -1;
		for (const enemy of enemies) {
			const dx = enemy.x - this.x;
			const dy = enemy.y - this.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist <= this.range) {
				if (enemy.waypointIndex > furthestWaypoint) {
					furthestWaypoint = enemy.waypointIndex;
					bestEnemy = enemy;
				}
			}
		}
		return bestEnemy;
	}

	update(enemies) {
		if (this.cooldown > 0) this.cooldown--;

		const config = towerConfig[this.type];

		// Drone logic
		if (config.spawnDrone) {
			this.droneTimer++;
			if (this.droneTimer >= 600) {
				this.droneTimer = 0;
				const base = path[path.length - 1];
				drones.push(new Drone(base.x, base.y, 50, 50));
			}
		}

		// Mythical: Blackhole logic
		if (config.blackholeInterval) {
			this.blackholeTimer++;
			if (this.blackholeTimer >= config.blackholeInterval) {
				this.blackholeTimer = 0;
				const ptsInRange = [];
				for (let i = 0; i < 15; i++) {
					const pt = getRandomPathPoint();
					const dist = Math.sqrt((pt.x - this.x) ** 2 + (pt.y - this.y) ** 2);
					if (dist <= this.range) ptsInRange.push(pt);
				}
				if (ptsInRange.length > 0) {
					const pt = ptsInRange[Math.floor(Math.random() * ptsInRange.length)];
					blackholes.push(
						new Blackhole(
							pt.x,
							pt.y,
							config.blackholeDuration,
							config.blackholeDamage,
							config.blackholeRadius,
						),
					);
				}
			}
		}

		// Mythical: Void Barrier logic
		if (config.voidBarrierHp) {
			this.voidBarrierTimer++;
			if (this.voidBarrierTimer >= 480) {
				// every 8s
				this.voidBarrierTimer = 0;
				this.myBarriers = this.myBarriers.filter((b) => !b.dead);
				if (this.myBarriers.length < 4) {
					const pt = getRandomPathPoint();
					const newBarrier = new Barrier(
						pt.x,
						pt.y,
						config.voidBarrierHp,
						"#9b59b6",
					);
					newBarrier.radius = 15;
					barriers.push(newBarrier);
					this.myBarriers.push(new Barrier());
				}
			}
		}

		// Mythical: Satellite logic
		if (config.spawnSatellite) {
			this.satelliteTimer++;
			if (this.satelliteTimer >= 300) {
				// every 5s
				this.satelliteTimer = 0;
				const base = path[path.length - 1];
				satellites.push(
					new Satellite(
						base.x,
						base.y,
						config.satelliteDamage,
						config.satelliteCd,
						config.satelliteRange,
					),
				);
			}
		}

		// Standard Barrier logic
		if (config.barrierHp) {
			this.barrierTimer++;
			if (this.barrierTimer >= (config.barrierInterval || 600)) {
				this.barrierTimer = 0;
				this.myBarriers = this.myBarriers.filter((b) => !b.dead);
				if (this.myBarriers.length < 3) {
					const pt = getRandomPathPoint();
					const newBarrier = new Barrier(
						pt.x,
						pt.y,
						config.barrierHp,
						this.color,
					);
					barriers.push(newBarrier);
					this.myBarriers.push(new Barrier());
				}
			}
		}

		if (config.incomeInterval) {
			this.incomeTimer++;
			if (this.incomeTimer >= config.incomeInterval) {
				this.incomeTimer = 0;
				money += config.income;
			}
		}

		if (this.type === "tower-carrot") return;

		const target = this.findTarget(enemies);
		if (target) {
			this.angle = Math.atan2(target.y - this.y, target.x - this.x);
			if (this.cooldown <= 0) {
				let finalDamage = this.damage;
				let maxBoost = 0;
				towers.forEach((other) => {
					if (other === this) return;
					const otherConfig = towerConfig[other.type];
					if (otherConfig.boostRange) {
						const dist = Math.sqrt(
							(other.x - this.x) ** 2 + (other.y - this.y) ** 2,
						);
						if (dist <= otherConfig.boostRange) {
							maxBoost = Math.max(maxBoost, otherConfig.boostAmount || 0);
						}
					}
				});
				finalDamage *= 1 + maxBoost;

				projectiles.push(
					new Projectile(
						this.x,
						this.y,
						target,
						finalDamage,
						this.color,
						this.type,
					),
				);
				this.cooldown = this.fireRate;
			}
		}
	}

	draw() {
		ctx.save();
		ctx.translate(this.x, this.y);
		if (this.type !== "tower-carrot") {
			ctx.rotate(this.angle);
		}
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "#222";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.rect(-15, -15, 30, 30);
		ctx.fill();
		ctx.stroke();

		if (this.type === "tower-carrot" || this.type === "tower-dog-keeper") {
			ctx.fillStyle = "#2ecc71";
			ctx.beginPath();
			ctx.arc(0, 0, 5, 0, Math.PI * 2);
			ctx.fill();
		} else {
			ctx.fillStyle = "#333";
			ctx.fillRect(5, -4, 15, 8);
		}
		ctx.restore();
	}
}

function isPathCollision(x, y) {
	const pathWidth = 40;
	const towerSize = 30;
	for (let i = 0; i < path.length - 1; i++) {
		const p1 = path[i];
		const p2 = path[i + 1];
		const dx = p2.x - p1.x;
		const dy = p2.y - p1.y;
		const l2 = dx * dx + dy * dy;
		if (l2 === 0) continue;
		let t = ((x - p1.x) * dx + (y - p1.y) * dy) / l2;
		t = Math.max(0, Math.min(1, t));
		const projX = p1.x + t * dx;
		const projY = p1.y + t * dy;
		const dist = Math.sqrt((x - projX) ** 2 + (y - projY) ** 2);
		if (dist < pathWidth / 2 + towerSize / 2) return true;
	}
	return false;
}

function spawnWave() {
	if (isWaveActive) return;
	wave++;
	isWaveActive = true;
	updateUI();
	enemySpawnedInWave = 0;

	// Exponential progressive difficulty factor: enemies get 2% health bonus compounded each wave
	const progressiveFactor = Math.pow(1.02, wave - 1);

	if (wave % 10 === 0) {
		totalEnemiesInWave = 1;
		const milestone = wave / 10;
		let bossColor = "#000000";
		let bossSize = 25;
		let bossSpeedMult = 1.0;
		let bossDamageMult = 1.0;
		switch (milestone % 4) {
			case 1:
				bossSize = 28;
				break;
			case 2:
				bossSize = 22;
				bossSpeedMult = 1.4;
				bossDamageMult = 0.8;
				break;
			case 3:
				bossSize = 38;
				bossSpeedMult = 0.6;
				bossDamageMult = 2.5;
				break;
			case 0:
				bossSize = 24;
				bossSpeedMult = 2.0;
				bossDamageMult = 1.5;
				break;
		}
		// Progressively higher HP calculation: increased base to 2000 and added milestone-based exponential scaling (1.5^milestone)
		const bossHealth =
			2000 *
			currentEnemyMultiplier *
			milestone *
			Math.pow(1.5, milestone - 1) *
			progressiveFactor;
		const bossBounty = 30;
		const bossSpeed = currentEnemySpeed * (0.7 / 2.5) * bossSpeedMult;
		const bossDamage = Math.floor((5 + milestone * 5) * bossDamageMult);
		const boss = new Enemy(
			bossHealth,
			bossSpeed,
			bossColor,
			bossBounty,
			bossDamage,
		);
		boss.radius = bossSize;
		enemies.push(boss);
		enemySpawnedInWave = 1;
	} else {
		totalEnemiesInWave = 5 + wave * 2;
		// Calculate frame-based spawn delay (assuming 60fps base)
		spawnDelay = Math.floor(((1000 - Math.min(wave * 50, 600)) / 1000) * 60);
		spawnTimer = 0; // Trigger first spawn immediately
	}
}

function drawPath() {
	if (path.length === 0) return;
	ctx.lineWidth = 40;
	ctx.strokeStyle = "#555";
	ctx.beginPath();
	ctx.moveTo(path[0].x, path[0].y);
	path.forEach((p) => ctx.lineTo(p.x, p.y));
	ctx.stroke();
	ctx.closePath();
}

function victory() {
	isGameOver = true;
	const title = document.querySelector("#game-over h1");
	if (title) title.textContent = "VICTORY!";
	const msg = document.querySelector("#game-over p");
	if (msg)
		msg.innerHTML = `Congratulations! You survived all <strong>${wave}</strong> waves!`;
	gameOverOverlay.classList.remove("hidden");
}

function gameOver() {
	isGameOver = true;
	finalWaveEl.textContent = wave;
	gameOverOverlay.classList.remove("hidden");
}

function gameLoop() {
	if (isGameOver) return;

	let needsUIUpdate = false;

	// --- Logic Loop --- runs 'gameSpeed' times per frame
	for (let s = 0; s < gameSpeed; s++) {
		// Wave Spawning Logic (Frame-Based)
		if (isWaveActive && enemySpawnedInWave < totalEnemiesInWave) {
			spawnTimer--;
			if (spawnTimer <= 0) {
				const progressiveFactor = Math.pow(1.02, wave - 1);
				const type = Math.random();
				if (type > 0.94) {
					enemies.push(
						new Enemy(
							(800 + wave * 100) * currentEnemyMultiplier * progressiveFactor,
							currentEnemySpeed * (0.8 / 2.5),
							"#8e44ad",
							10,
							2,
						),
					);
				} else if (type > 0.8 && wave > 4) {
					enemies.push(
						new Enemy(
							(300 + wave * 50) * currentEnemyMultiplier * progressiveFactor,
							currentEnemySpeed * (1.2 / 2.5),
							"#ff0000",
							5,
							5,
						),
					);
				} else if (type > 0.65 && wave > 2) {
					enemies.push(
						new Enemy(
							(120 + wave * 25) * currentEnemyMultiplier * progressiveFactor,
							currentEnemySpeed * (1.5 / 2.5),
							"#2ecc71",
							10,
							1,
						),
					);
				} else if (type > 0.4 && wave > 1) {
					enemies.push(
						new Enemy(
							(30 + wave * 5) * currentEnemyMultiplier * progressiveFactor,
							currentEnemySpeed * (4 / 2.5),
							"#3498db",
							7.5,
							1,
						),
					);
				} else {
					enemies.push(
						new Enemy(
							(60 + wave * 12) * currentEnemyMultiplier * progressiveFactor,
							currentEnemySpeed,
							"#e74c3c",
							5,
							1,
						),
					);
				}
				enemySpawnedInWave++;
				spawnTimer = spawnDelay;
			}
		}

		// Barriers dead check
		for (let i = barriers.length - 1; i >= 0; i--) {
			if (barriers[i].dead && isWaveActive) {
				barriers.splice(i, 1);
			}
		}

		// Towers
		towers.forEach((tower) => {
			if (isWaveActive) tower.update(enemies);
		});

		// Drones
		for (let i = drones.length - 1; i >= 0; i--) {
			if (isWaveActive) drones[i].update();
			if (drones[i].dead) {
				drones.splice(i, 1);
			}
		}

		// Blackholes
		for (let i = blackholes.length - 1; i >= 0; i--) {
			if (isWaveActive) blackholes[i].update();
			if (blackholes[i].dead) {
				blackholes.splice(i, 1);
			}
		}

		// Satellites
		for (let i = satellites.length - 1; i >= 0; i--) {
			if (isWaveActive) satellites[i].update();
			if (satellites[i].dead) {
				satellites.splice(i, 1);
			}
		}

		// Projectiles
		for (let i = projectiles.length - 1; i >= 0; i--) {
			if (isWaveActive) projectiles[i].update();
			if (projectiles[i].dead) {
				if (isWaveActive) projectiles.splice(i, 1);
			}
		}

		// Enemies
		for (let i = enemies.length - 1; i >= 0; i--) {
			const enemy = enemies[i];
			if (enemy.health <= 0) {
				money += enemy.bounty;
				needsUIUpdate = true;
				enemies.splice(i, 1);
				continue;
			}
			if (!enemy.update()) {
				health -= enemy.damage;
				needsUIUpdate = true;
				enemies.splice(i, 1);
				if (health <= 0) {
					gameOver();
					return;
				}
			}
		}

		// Wave Completion Logic
		if (
			enemies.length === 0 &&
			isWaveActive &&
			enemySpawnedInWave >= totalEnemiesInWave
		) {
			isWaveActive = false;
			money += 25;
			towers.forEach((tower) => {
				if (tower.type === "tower-carrot") money += 100;
			});
			needsUIUpdate = true;

			if (wave >= currentMaxWaves) {
				victory();
				return;
			}
		}
	}

	if (needsUIUpdate) updateUI();

	// --- Rendering --- runs once per frame
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPath();

	barriers.forEach((b) => b.draw());
	towers.forEach((t) => t.draw());
	drones.forEach((d) => d.draw());
	blackholes.forEach((bh) => bh.draw());
	satellites.forEach((st) => st.draw());
	projectiles.forEach((p) => p.draw());
	enemies.forEach((e) => e.draw());

	if (selectedTower) {
		const config = towerConfig[selectedTower.type];
		ctx.beginPath();
		ctx.arc(
			selectedTower.x,
			selectedTower.y,
			selectedTower.range,
			0,
			Math.PI * 2,
		);
		ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.closePath();

		if (config.aoe && config.aoeRange) {
			ctx.beginPath();
			ctx.setLineDash([5, 5]);
			ctx.arc(
				selectedTower.x,
				selectedTower.y,
				config.aoeRange,
				0,
				Math.PI * 2,
			);
			ctx.strokeStyle = "rgba(255, 100, 100, 0.6)";
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.closePath();
		}

		if (config.boostRange) {
			ctx.beginPath();
			ctx.arc(
				selectedTower.x,
				selectedTower.y,
				config.boostRange,
				0,
				Math.PI * 2,
			);
			ctx.strokeStyle = "rgba(255, 165, 0, 0.6)";
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.closePath();
		}

		ctx.strokeStyle = "#ffcc00";
		ctx.lineWidth = 3;
		ctx.strokeRect(selectedTower.x - 18, selectedTower.y - 18, 36, 36);
	}
	if (selectedTowerType) {
		const rect = canvas.getBoundingClientRect();
		const realX = (mousePos.x * canvas.width) / rect.width;
		const realY = (mousePos.y * canvas.height) / rect.height;
		const gridX = Math.floor(realX / gridSize) * gridSize + gridSize / 2;
		const gridY = Math.floor(realY / gridSize) * gridSize + gridSize / 2;

		const config = towerConfig[selectedTowerType];
		const incomeUnitCount = towers.filter(
			(t) => towerConfig[t.type].income !== undefined,
		).length;
		const incomeLimitReached =
			config.income !== undefined && incomeUnitCount >= incomeUnitLimit;

		const isInvalid =
			isWaveActive ||
			towers.length >= unitLimit ||
			incomeLimitReached ||
			isPathCollision(gridX, gridY) ||
			towers.some((t) => t.x === gridX && t.y === gridY);

		ctx.globalAlpha = 0.5;
		ctx.fillStyle = isInvalid ? "#ff0000" : config.color;
		ctx.beginPath();
		ctx.rect(gridX - 15, gridY - 15, 30, 30);
		ctx.fill();

		ctx.beginPath();
		ctx.arc(gridX, gridY, config.range, 0, Math.PI * 2);
		ctx.strokeStyle = isInvalid ? "rgba(255,0,0,0.3)" : "rgba(255,255,255,0.2)";
		ctx.stroke();

		if (config.aoe && config.aoeRange) {
			ctx.beginPath();
			ctx.setLineDash([5, 5]);
			ctx.arc(gridX, gridY, config.aoeRange, 0, Math.PI * 2);
			ctx.strokeStyle = isInvalid
				? "rgba(255, 0, 0, 0.4)"
				: "rgba(255, 100, 100, 0.4)";
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.closePath();
		}

		if (config.boostRange) {
			ctx.beginPath();
			ctx.arc(gridX, gridY, config.boostRange, 0, Math.PI * 2);
			ctx.strokeStyle = isInvalid
				? "rgba(255, 0, 0, 0.4)"
				: "rgba(255, 165, 0, 0.4)";
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.closePath();
		}

		ctx.globalAlpha = 1.0;
	}
	requestAnimationFrame(gameLoop);
}

canvas.addEventListener("mousemove", (e) => {
	const rect = canvas.getBoundingClientRect();
	mousePos.x = e.clientX - rect.left;
	mousePos.y = e.clientY - rect.top;
});

canvas.addEventListener("click", () => {
	if (isGameOver) return;
	const rect = canvas.getBoundingClientRect();
	const realX = (mousePos.x * canvas.width) / rect.width;
	const realY = (mousePos.y * canvas.height) / rect.height;
	const clickedTower = towers.find(
		(t) =>
			realX >= t.x - 15 &&
			realX <= t.x + 15 &&
			realY >= t.y - 15 &&
			realY <= t.y + 15,
	);
	if (clickedTower) {
		selectedTower = clickedTower;
		updateUI();
		return;
	} else {
		selectedTower = null;
		updateUI();
	}
	if (!selectedTowerType) return;

	// Restrict tower placement if a wave is currently in progress
	if (isWaveActive) return;

	const gridX = Math.floor(realX / gridSize) * gridSize + gridSize / 2;
	const gridY = Math.floor(realY / gridSize) * gridSize + gridSize / 2;

	const config = towerConfig[selectedTowerType];
	const incomeUnitCount = towers.filter(
		(t) => towerConfig[t.type].income !== undefined,
	).length;
	const incomeLimitReached =
		config.income !== undefined && incomeUnitCount >= incomeUnitLimit;

	if (
		towers.length < unitLimit &&
		!incomeLimitReached &&
		money >= config.cost &&
		!isPathCollision(gridX, gridY) &&
		!towers.some((t) => t.x === gridX && t.y === gridY)
	) {
		money -= config.cost;
		towers.push(new Tower(gridX, gridY, selectedTowerType));
		if (selectedShopIndex !== -1) {
			shopTowers[selectedShopIndex] = null;
			selectedShopIndex = -1;
			selectedTowerType = null;
		}
		updateUI();
	}
});

document.querySelectorAll(".diff-btn").forEach((btn) => {
	btn.addEventListener("click", () => {
		startGame(btn.dataset.difficulty);
	});
});

nextWaveBtn.addEventListener("click", spawnWave);

// Speed Control Listeners
document.querySelectorAll(".speed-btn").forEach((btn) => {
	btn.addEventListener("click", () => {
		gameSpeed = parseInt(btn.dataset.speed);
		document
			.querySelectorAll(".speed-btn")
			.forEach((b) => b.classList.remove("selected"));
		btn.classList.add("selected");
	});
});

rerollBtn.addEventListener("click", () => {
	if (money >= rerollCost) {
		money -= rerollCost;
		selectedTowerType = null;
		selectedShopIndex = -1;
		refreshShop();
		updateUI();
	}
});

// Index Navigation Listeners
document.getElementById("toggle-index-btn").onclick = () => {
	const indexEl = document.getElementById("tower-index");
	indexEl.classList.toggle("hidden");
	if (!indexEl.classList.contains("hidden")) {
		renderTowerIndex();
	}
};

document.getElementById("index-prev-btn").onclick = () => {
	if (indexPage > 0) {
		indexPage--;
		renderTowerIndex();
	}
};

document.getElementById("index-next-btn").onclick = () => {
	const towerKeys = Object.keys(towerConfig);
	if (indexPage < towerKeys.length - 1) {
		indexPage++;
		renderTowerIndex();
	}
};

sellTowerBtn.onclick = () => {
	if (selectedTower) {
		const config = towerConfig[selectedTower.type];
		const sellPrice = Math.floor(config.cost * 0.7);
		money += sellPrice;
		towers = towers.filter((t) => t !== selectedTower);
		selectedTower = null;
		updateUI();
	}
};

gameLoop();
