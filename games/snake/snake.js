function Snake(min_x, max_x, min_y, max_y) {
	this.x = 0;
	this.y = 0;
	this.xspeed = 1;
	this.yspeed = 0;

	this.max_x = max_x;
	this.max_y = max_y;
	this.min_x = min_x;
	this.min_y = min_y;

	this.length = 0;
	this.history = [];

	this.change_dir = function(x,y) {
		if(Math.abs(this.xspeed - x) <= 1){
			this.xspeed = x;
		}
		if(Math.abs(this.yspeed - y) <= 1){
			this.yspeed = y;
		}
	}

	this.update = function() {
		this.x += this.xspeed;
		this.y += this.yspeed;

		//handle overflow on the edges by wrapping
		if(this.x >= this.max_x){
			this.x = this.min_x;
		}
		if(this.x < this.min_x){
			this.x = this.max_x;
		}
		if(this.y >= this.max_y){
			this.y = this.min_y;
		}
		if(this.y < this.min_y){
			this.y = this.max_y;
		}

		for(var i=0; i < this.history.length; i++) {

		}
	}

	this.consume = function(food) {
		if(this.x === food.x && this.y === food.y) {
			this.length ++;
			food.update();
		}
	}


	this.show = function(ctx, scale) {
		ctx.beginPath();
		ctx.fillStyle = "#FFFFFF"
		ctx.rect(this.x*scale, this.y*scale, scale, scale);
		ctx.fill();
		ctx.closePath();
	}
}

function Food(min_x, max_x, min_y, max_y) {
	this.max_x = max_x;
	this.max_y = max_y;
	this.min_x = min_x;
	this.min_y = min_y;

	this.x = Math.floor(Math.random()*(max_x-min_x)+min_x);
	this.y = Math.floor(Math.random()*(max_y-min_y)+min_y);

	this.update = function() {
		this.x = Math.floor(Math.random()*(max_x-min_x)+min_x);
		this.y = Math.floor(Math.random()*(max_y-min_y)+min_y);
	}

	this.show = function(ctx, scale) {
		ctx.beginPath();
		ctx.fillStyle = "#FF0000"
		ctx.rect(this.x*scale, this.y*scale, scale, scale);
		ctx.fill();
		ctx.closePath();
	}
}