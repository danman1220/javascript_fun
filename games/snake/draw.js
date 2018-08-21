var canvas;
var ctx;
var height;
var width;
var scale = 20; //px per unit
var frames_per_second = 3;

var current_frame;

var snake;

function setup() {

	if(current_frame){
		window.cancelAnimationFrame(current_frame);
	}

	canvas = document.getElementById("canvas1");
	ctx = canvas.getContext("2d");
	height = canvas.height;
	width = canvas.width;

	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0,0,width,height);

	ctx.translate(width/2,height/2);

	ctx.beginPath();
	ctx.fillStyle = "#000000"
	ctx.rect(-width,-height,width*2,height*2);
	ctx.fill();
	ctx.closePath();

	snake = new Snake(-width/(2*scale), width/(2*scale), -height/(2*scale), height/(2*scale));
	food = new Food(-width/(2*scale), width/(2*scale), -height/(2*scale), height/(2*scale));

	snake.show(ctx, scale);
	food.show(ctx, scale);

	current_frame = window.requestAnimationFrame(draw);
}

function draw() {

	setTimeout(function() {
		snake.update();
		snake.consume(food);

		ctx.clearRect(-width,-height,width*2,height*2);
		
		ctx.beginPath();
		ctx.fillStyle = "#000000"
		ctx.rect(-width,-height,width*2,height*2);
		ctx.fill();
		ctx.closePath();

		snake.show(ctx, scale);
		food.show(ctx, scale);

		current_frame = window.requestAnimationFrame(draw);
	}, 1000/frames_per_second);	
}

function listen_for_direction(e) {
	switch(e.keyCode) {
		case 37:
			snake.change_dir(-1,0);
		break;

		case 38:
			snake.change_dir(0,-1);
		break;

		case 39:
			snake.change_dir(1,0);
		break;

		case 40:
			snake.change_dir(0,1);
		break;
	}
}

window.onload = function() {
	setup();
}

document.onkeydown = listen_for_direction;