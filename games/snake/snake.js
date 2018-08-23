function Snake(min_x, max_x, min_y, max_y) {
	this.x = 0;
	this.y = 0;
	this.xspeed = 1;
	this.yspeed = 0;

	this.max_x = max_x;
	this.max_y = max_y;
	this.min_x = min_x;
	this.min_y = min_y;

	this.score = 0;
	this.history = [];

	this.is_dead = false;

	//load in the head image
	this.head_img = new Image();
	this.head_img.src = 'snake_1.png';

	this.change_dir = function(x,y) {
		if(Math.abs(this.xspeed - x) <= 1){
			this.xspeed = x;
		}
		if(Math.abs(this.yspeed - y) <= 1){
			this.yspeed = y;
		}
	}

	this.update = function() {
		//fun hacks to make updating smoother
		if(this.history.length < this.score){
			this.history.push([this.x,this.y]);
		} else if(this.history.length > 0){
			this.history.shift();
			this.history.push([this.x,this.y]);
		}

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

		//check to see if it ate itself
		for(var i=0; i < this.history.length; i++){
			if(this.history[i][0] === this.x && this.history[i][1] === this.y){
				this.is_dead = true;
				break;
			}
		}
		
	}

	this.consume = function(food) {
		if(this.x === food.x && this.y === food.y) {
			this.score ++;
			return true;
		}
		return false;
	}

	this.check_death = function(){
		return this.is_dead;
	}


	this.show = function(ctx, scale) {
		ctx.beginPath();

		//draw a head :) TODO abstract to draw_with_orientation method
		if(this.xspeed === 1){
			// ctx.fillStyle = "#FFFFFF";
			// ctx.rect(this.x*scale, this.y*scale, scale-2, scale);
			// ctx.fill();
			// ctx.closePath();

			// ctx.beginPath();
			// ctx.fillStyle = "#00FF00";
			// ctx.rect(this.x*scale+(scale-4), this.y*scale + scale/2-1, 8,2);
			// ctx.fill();
			// ctx.closePath();
			ctx.drawImage(this.head_img,this.x*scale,this.y*scale);

		} else if(this.xspeed === -1){
			// ctx.fillStyle = "#FFFFFF";
			// ctx.rect(this.x*scale+2, this.y*scale, scale-2, scale);
			// ctx.fill();
			// ctx.closePath();

			// ctx.beginPath();
			// ctx.fillStyle = "#00FF00";
			// ctx.rect(this.x*scale-4, this.y*scale + scale/2-1, 8,2);
			// ctx.fill();
			// ctx.closePath();
			ctx.save();
			ctx.translate(this.x*scale + scale/2, this.y*scale + scale/2);
			ctx.rotate(Math.PI);
			ctx.drawImage(this.head_img,-scale/2,-scale/2);
			ctx.restore();

		} else if(this.yspeed === 1) {
			// ctx.fillStyle = "#FFFFFF";
			// ctx.rect(this.x*scale, this.y*scale, scale, scale-2);
			// ctx.fill();
			// ctx.closePath();

			// ctx.beginPath();
			// ctx.fillStyle = "#00FF00";
			// ctx.rect(this.x*scale+scale/2, this.y*scale+(scale-4), 2,8);
			// ctx.fill();
			// ctx.closePath();
			ctx.save();
			ctx.translate(this.x*scale + scale/2, this.y*scale + scale/2);
			ctx.rotate(Math.PI/2);
			ctx.drawImage(this.head_img,-scale/2,-scale/2);
			ctx.restore();

		} else if(this.yspeed === -1) {
			// ctx.fillStyle = "#FFFFFF";
			// ctx.rect(this.x*scale, this.y*scale+2, scale, scale-2);
			// ctx.fill();
			// ctx.closePath();

			// ctx.beginPath();
			// ctx.fillStyle = "#00FF00";
			// ctx.rect(this.x*scale+scale/2, this.y*scale-4, 2,8);
			// ctx.fill();
			// ctx.closePath();	
			ctx.save();
			ctx.translate(this.x*scale + scale/2, this.y*scale + scale/2);
			ctx.rotate(3*Math.PI/2);
			ctx.drawImage(this.head_img,-scale/2,-scale/2);
			ctx.restore()
		}

		//draw in the tail
		for(var i=0; i < this.history.length; i++) {
			ctx.beginPath();
			ctx.fillStyle = "#FFFFFF"
			ctx.rect(this.history[i][0]*scale+3, this.history[i][1]*scale+3, scale-6, scale-6);
			ctx.fill();
			ctx.closePath();
		}
	}
}



function Food(x,y) {
	this.x = x;
	this.y = y

	this.show = function(ctx, scale) {
		ctx.beginPath();
		ctx.fillStyle = "#FF0000"
		ctx.rect(this.x*scale, this.y*scale, scale, scale);
		ctx.fill();
		ctx.closePath();
	}
}