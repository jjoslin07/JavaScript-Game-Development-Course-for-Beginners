// Setup canvas for game
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = (canvas.width = 800);
const CANVAS_HEIGHT = (canvas.height = 700);
let gameSpeed = 5;
//let gameFrame = 0;
// Each background element layer
const backgroundLayer1 = new Image();
backgroundLayer1.src = './backgroundLayers/layer-1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = './backgroundLayers/layer-2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = './backgroundLayers/layer-3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = './backgroundLayers/layer-4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = './backgroundLayers/layer-5.png';

// Event listener that waits for the page to fully load before the game starts
window.addEventListener('load', function () {
	const slider = document.getElementById('slider');
	slider.value = gameSpeed;
	const showGameSpeed = document.getElementById('showGameSpeed');
	showGameSpeed.innerHTML = gameSpeed;
	slider.addEventListener('change', function (e) {
		gameSpeed = e.target.value;
		showGameSpeed.innerHTML = e.target.value;
	});
	// Layer Object is a blueprint for the layers of the background
	class Layer {
		constructor(image, speedModifier) {
			this.x = 0;
			this.y = 0;
			this.width = 2400;
			this.height = 700;
			this.image = image;
			this.speedModifier = speedModifier;
			this.speed = gameSpeed * this.speedModifier;
		}
		update() {
			this.speed = gameSpeed * this.speedModifier;
			if (this.x <= -this.width) {
				this.x = 0;
			}
			this.x = Math.floor(this.x - this.speed);
			//this.x = (gameFrame * this.speed) % this.width;
		}
		draw() {
			ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
			ctx.drawImage(
				this.image,
				this.x + this.width,
				this.y,
				this.width,
				this.height
			);
		}
	}
	// Each layer of the background
	const layer1 = new Layer(backgroundLayer1, 0.2);
	const layer2 = new Layer(backgroundLayer2, 0.4);
	const layer3 = new Layer(backgroundLayer3, 0.6);
	const layer4 = new Layer(backgroundLayer4, 0.8);
	const layer5 = new Layer(backgroundLayer5, 1);
	// Array of each layer object
	const gameObjects = [layer1, layer2, layer3, layer4, layer5];
	// Function that cycles through each object in gameObjects and updates and draws layer
	function animate() {
		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		gameObjects.forEach((object) => {
			object.update();
			object.draw();
		});
		//gameFrame--;
		requestAnimationFrame(animate);
	}
	animate();
});
