/** @type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const ctxcollisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let score = 0;
let lives = 3;
let gameOver = false;
ctx.font = '50px Impact';

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let getNewLife = 0;

let ravens = [];
let paused = false;
function togglePause() {
	if (!paused) {
		paused = true;
	} else if (paused) {
		paused = false;
	}
}
window.addEventListener('keydown', function (e) {
	const key = e.key;
	if (key === 'p') {
		// p key
		togglePause();
	}
});

class Raven {
	constructor() {
		this.spriteWidth = 271;
		this.spriteHeight = 194;
		this.sizeModifier = Math.random() * 0.6 + 0.4;
		this.width = this.spriteWidth * this.sizeModifier;
		this.height = this.spriteHeight * this.sizeModifier;
		this.x = canvas.width;
		this.y = Math.random() * (canvas.height - this.height);
		this.directionX = Math.random() * 5 + 3;
		this.direcitonY = Math.random() * 5 - 2.5;
		this.markedForDeletion = false;
		this.image = new Image();
		this.image.src = 'raven.png';
		this.frame = 0;
		this.maxFrame = 4;
		this.timeSinceFlap = 0;
		this.flapInterval = Math.random() * 50 + 50;
		this.randomColors = [
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255),
		];
		this.color =
			'rgb(' +
			this.randomColors[0] +
			',' +
			this.randomColors[1] +
			',' +
			this.randomColors[2] +
			')';
		this.hasTrail = Math.random() > 0.5;
	}

	update(deltaTime) {
		if (this.y < 0 || this.y > canvas.height - this.height) {
			this.direcitonY = this.direcitonY * -1;
		}
		this.x -= this.directionX;
		this.y += this.direcitonY;
		if (this.x < 0 - this.width) this.markedForDeletion = true;
		this.timeSinceFlap += deltaTime;
		if (this.timeSinceFlap > this.flapInterval) {
			if (this.frame > this.maxFrame) this.frame = 0;
			else this.frame++;
			this.timeSinceFlap = 0;
			if (this.hasTrail) {
				for (let i = 0; i < 5; i++) {
					particles.push(new Particle(this.x, this.y, this.width, this.color));
				}
			}
		}
		if (this.x < 0 - this.width) lives--;
		if (lives < 0) gameOver = true;
		if (getNewLife === 10) {
			lives++;
			getNewLife = 0;
		}
	}

	draw() {
		ctxcollisionCtx.fillStyle = this.color;
		ctxcollisionCtx.fillRect(this.x, this.y, this.width, this.height);
		ctx.drawImage(
			this.image,
			this.frame * this.spriteWidth,
			0,
			this.spriteWidth,
			this.spriteHeight,
			this.x,
			this.y,
			this.width,
			this.height
		);
	}
}

let explosions = [];
class Explosion {
	constructor(x, y, size) {
		this.image = new Image();
		this.image.src = 'boom.png';
		this.spriteWidth = 200;
		this.spriteHeight = 179;
		this.size = size;
		this.x = x;
		this.y = y;
		this.frame = 0;
		this.sound = new Audio();
		this.sound.src = 'boom.wav';
		this.timeSinceLastFrame = 0;
		this.frameInterval = 200;
		this.markedForDeletion = false;
	}

	update(deltaTime) {
		if (this.frame === 0) this.sound.play();
		this.timeSinceLastFrame += deltaTime;
		if (this.timeSinceLastFrame > this.frameInterval) {
			this.frame++;
			this.timeSinceLastFrame = 0;
			if (this.frame > 5) this.markedForDeletion = true;
		}
	}
	draw() {
		ctx.drawImage(
			this.image,
			this.frame * this.spriteWidth,
			0,
			this.spriteWidth,
			this.spriteHeight,
			this.x,
			this.y - this.size / 4,
			this.size,
			this.size
		);
	}
}

let particles = [];
class Particle {
	constructor(x, y, size, color) {
		this.size = size;
		this.x = x + this.size / 2 + Math.random() * 50 - 25;
		this.y = y + this.size / 3 + Math.random() * 50 - 25;
		this.radius = (Math.random() * this.size) / 10;
		this.maxRadius = Math.random() * 20 + 35;
		this.markedForDeletion = false;
		this.speedX = Math.random() * 1 + 0.5;
		this.color = color;
	}
	update() {
		this.x += this.speedX;
		this.radius += 0.3;
		if (this.radius > this.maxRadius - 5) this.markedForDeletion = true;
	}
	draw() {
		ctx.save();
		ctx.globalAlpha = 1 - this.radius / this.maxRadius;
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	}
}

function drawScore() {
	ctx.save();
	ctx.fillStyle = 'black';
	ctx.fillText('Score: ' + score, 50, 75);
	ctx.fillStyle = 'white';
	ctx.fillText('Score: ' + score, 55, 80);
	ctx.restore();
}
function drawLives() {
	ctx.save();
	ctx.fillStyle = 'black';
	ctx.fillText('Lives: ' + lives, 275, 75);
	ctx.fillStyle = 'white';
	ctx.fillText('Lives: ' + lives, 280, 80);
	ctx.restore();
}

function drawGameOver() {
	ctx.save();
	const audio = new Audio();
	audio.src = 'game-over-2.wav';
	audio.play();
	ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	ctx.fillText('GAME OVER ', canvas.width * 0.5 - 5, canvas.height * 0.5 - 5);
	ctx.fillStyle = 'white';
	ctx.fillText('GAME OVER ', canvas.width * 0.5, canvas.height * 0.5);
	ctx.fillText('😵', canvas.width * 0.5 + 135, canvas.height * 0.5);
	ctx.fillText('😵', canvas.width * 0.5 - 145, canvas.height * 0.5);
	ctx.restore();
}
function drawPause() {
	ctx.save();
	ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	ctx.fillText('PAUSED', canvas.width * 0.5 + 5, canvas.height * 0.5 + 5);
	ctx.fillStyle = 'white';
	ctx.fillText('PAUSED', canvas.width * 0.5, canvas.height * 0.5);
	ctx.restore();
}

window.addEventListener('click', function (e) {
	const detectPixelColor = ctxcollisionCtx.getImageData(e.x, e.y, 1, 1);
	const pc = detectPixelColor.data;
	ravens.forEach((object) => {
		if (
			object.randomColors[0] === pc[0] &&
			object.randomColors[1] === pc[1] &&
			object.randomColors[2] === pc[2]
		) {
			object.markedForDeletion = true;
			score++;
			getNewLife++;
			explosions.push(new Explosion(object.x, object.y, object.width));
		}
	});
});
// Secret key to add more lives 😈
window.addEventListener('keydown', (e) => {
	if (e.key === '$') {
		lives++;
	}
});
// Secret key to destroy ravens without using mouse 😈
window.addEventListener('keydown', (e) => {
	if (e.key === '~') {
		ravens[0].markedForDeletion = true;
		score++;
		getNewLife++;
		explosions.push(new Explosion(e.x, e.y, e.width));
	}
});

function animate(timeStamp) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctxcollisionCtx.clearRect(0, 0, canvas.width, canvas.height);
	let deltaTime = timeStamp - lastTime;
	lastTime = timeStamp;
	timeToNextRaven += deltaTime;
	if (timeToNextRaven > ravenInterval && paused === false) {
		ravens.push(new Raven());
		timeToNextRaven = 0;
		ravens.sort(function (a, b) {
			return a.width - b.width;
		});
	}

	drawLives();
	drawScore();
	if (!paused) {
		[...particles, ...ravens, ...explosions].forEach((object) =>
			object.update(deltaTime)
		);
		[...particles, ...ravens, ...explosions].forEach((object) => object.draw());
	}
	if (paused) drawPause();
	ravens = ravens.filter((object) => !object.markedForDeletion);
	explosions = explosions.filter((object) => !object.markedForDeletion);
	particles = particles.filter((object) => !object.markedForDeletion);
	if (!gameOver) requestAnimationFrame(animate);
	else drawGameOver();
}
animate(0);
