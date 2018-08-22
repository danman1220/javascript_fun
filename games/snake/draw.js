var canvas;
var ctx;
var score_elem;
var reset_button;
var height;
var width;
var scale = 20; //px per unit

var max_x; 
var min_x;
var max_y;
var min_y;

var frames_per_second = 3;

var current_frame;

var snake;

function setup() {

	if(current_frame){
		window.cancelAnimationFrame(current_frame);
	}

	reset_button.hidden = true;

	score_elem = document.getElementById("score");

	canvas = document.getElementById("canvas1");
	ctx = canvas.getContext("2d");
	height = canvas.height;
	width = canvas.width;

	max_x = width/(2*scale);
	min_x = -width/(2*scale);
	max_y = height/(2*scale);
	min_y = -height/(2*scale);


	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0,0,width,height);

	ctx.translate(width/2,height/2);

	ctx.beginPath();
	ctx.fillStyle = "#000000"
	ctx.rect(-width,-height,width*2,height*2);
	ctx.fill();
	ctx.closePath();

	snake = new Snake(min_x, max_x, min_y, max_y);

	do {
		food_x = Math.floor(Math.random()*(max_x-min_x)+min_x);
		food_y = Math.floor(Math.random()*(max_y-min_y)+min_y);
	} while(food_x != snake.x && food_y != snake.y);

	food = new Food(food_x, food_y);

	snake.show(ctx, scale);
	food.show(ctx, scale);

	current_frame = window.requestAnimationFrame(draw);
}

function draw() {

	setTimeout(function() {
		snake.update();
		if(snake.consume(food)){
			do {
				food_x = Math.floor(Math.random()*(max_x-min_x)+min_x);
				food_y = Math.floor(Math.random()*(max_y-min_y)+min_y);
			} while(food_x != snake.x && food_y != snake.y);

			food = new Food(food_x, food_y);
		}

		ctx.clearRect(-width,-height,width*2,height*2);
		
		ctx.beginPath();
		ctx.fillStyle = "#000000"
		ctx.rect(-width,-height,width*2,height*2);
		ctx.fill();
		ctx.closePath();

		snake.show(ctx, scale);
		food.show(ctx, scale);

		score_elem.textContent = "Score: " + snake.score;

		if(snake.check_death()){
			game_over();
		} else {
			current_frame = window.requestAnimationFrame(draw);
		}	
	}, 1000/frames_per_second);	
}

function game_over() {
	//TODO add some game over screen
	reset_button.hidden = false;
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
	reset_button = document.getElementById("reset");
	reset_button.onclick = setup;
	setup();
}

document.onkeydown = listen_for_direction;