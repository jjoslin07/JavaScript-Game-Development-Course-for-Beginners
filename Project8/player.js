export default class Player {
	constructor(gameWidth, gameHeight) {
		this.gameWidth = gameWidth;
		this.gameHeight = gameHeight;
		this.states = [];
		this.currentState = this.states[0];
		this.image = document.getElementById('dogImage');
		this.width = 200;
		this.height = 181.83;
		this.x = this.gameWidth / 2 - this.width / 2;
		this.y = this.gameHeight - this.height;
		this.frameX = 0;
		this.frameY = 0;
	}
	draw(context) {
		context.drawImage(
			this.image,
			this.width * this.frameX,
			this.height * this.frameY,
			this.width,
			this.height,
			this.x,
			this.y,
			this.width,
			this.height
		);
	}
}
