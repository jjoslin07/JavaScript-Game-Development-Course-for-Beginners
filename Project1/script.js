// Current state of animation
let playerState = 'idle';
const dropdown = document.getElementById('animations');
dropdown.addEventListener('change', function (e) {
	playerState = e.target.value;
});

// Canvas for animations
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGHT = (canvas.height = 600);

// Image object for canvas with source set to sprite sheet png
const playerImage = new Image();
playerImage.src = 'shadow_dog.png';
const spriteWidth = 575;
const spriteHeight = 523;
let gameFrame = 0;
const staggerFrames = 5;

const spriteAnimations = [];
/**
 *  An array of objects called animationStates that holds key value pairs
 *  for the name of the animation and how many frames it has
 * */
const animationStates = [{
		name: 'idle',
		frames: 7,
	},
	{
		name: 'jump',
		frames: 7,
	},
	{
		name: 'fall',
		frames: 7,
	},
	{
		name: 'run',
		frames: 9,
	},
	{
		name: 'dizzy',
		frames: 11,
	},
	{
		name: 'sit',
		frames: 5,
	},
	{
		name: 'roll',
		frames: 7,
	},
	{
		name: 'bite',
		frames: 7,
	},
	{
		name: 'ko',
		frames: 12,
	},
	{
		name: 'getHit',
		frames: 4,
	},
];
// Cycles through animations and then through each frame
animationStates.forEach((state, index) => {
	let frames = {
		loc: [],
	};
	for (let j = 0; j < state.frames; j++) {
		let positionX = j * spriteWidth;
		let positionY = index * spriteHeight;
		frames.loc.push({
			x: positionX,
			y: positionY,
		});
	}
	spriteAnimations[state.name] = frames;
});
// Selects each frame of an animation and draws the image on the canvas
function animate() {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	let position =
		Math.floor(gameFrame / staggerFrames) %
		spriteAnimations[playerState].loc.length;
	let frameX = spriteWidth * position;
	let frameY = spriteAnimations[playerState].loc[position].y;
	ctx.drawImage(
		playerImage,
		frameX,
		frameY,
		spriteWidth,
		spriteHeight,
		0,
		0,
		spriteWidth,
		spriteHeight
	);

	gameFrame++;
	requestAnimationFrame(animate);
}
animate();