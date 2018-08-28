var current_frame;
var canvas;
var ctx;
var width, height; //px per cell
var scale = 10;
var frames_per_second=60;

var max_x;
var max_y;

var light_gray  = "#CCCCCC";
var black = "#000000";
var white = "#FFFFFF";

var cell_factory;
var do_animate;

function setup(instantiate_fn) {
	if(current_frame) {
		window.cancelAnimationFrame(current_frame);
	}

	//setup logic
	canvas = document.getElementById("canvas1");
	ctx = canvas.getContext("2d");
	height = canvas.height;
	width = canvas.width;

	max_x = width/(scale);
	max_y = height/(scale);

	//start frozen
	do_animate = false;

	//instantiate cell factory
	if(instantiate_fn) {
		instantiate_fn();
	} else {
		cell_factory = new CellFactory(max_x, max_y);
		// cell_factory.initializeRandom();
		cell_factory.initializeLine(width/(2*scale));
	}

	window.requestAnimationFrame(drawFrame);

	// current_frame = window.requestAnimationFrame(draw);
}

function draw() {
	//called every frame

	//cancel animation if we need to
	if(!do_animate) {return;};

	setTimeout(function() {
		drawFrame();
		current_frame = window.requestAnimationFrame(draw);
	}, 1000/frames_per_second);
}


function drawFrame() {

		cell_factory.update();
		var current_state = cell_factory.getCurrentState();

		ctx.clearRect(0, 0, width, height);

		//draw grid
		for(var x=0; x*scale <= width; x++) {
			ctx.beginPath();
			ctx.strokeStyle = light_gray;
			ctx.moveTo(x*scale,0);
			ctx.lineTo(x*scale,height);
			ctx.stroke();
			ctx.closePath();
		}

		for(var y=0; y*scale <= height; y++) {
			ctx.beginPath();
			ctx.strokeStyle = light_gray;
			ctx.moveTo(0,y*scale);
			ctx.lineTo(width,y*scale);
			ctx.stroke();
			ctx.closePath();
		}

		for(var x = 0; x < current_state.length; x++) {
			for(var y = 0; y < current_state[x].length; y++) {
				if(current_state[x][y].isAlive()) {
					ctx.beginPath();
					ctx.fillStyle = black;
					ctx.rect(x*scale+1, y*scale+1, scale-2, scale-2);
					ctx.fill();
					ctx.closePath();
				}
			}
		}
	}


function pause() {
	do_animate = false;
}

function resume() {
	do_animate = true;
	draw();
}

function randomize() {
	setup(function() {
		cell_factory = new CellFactory(max_x,max_y);
		cell_factory.initializeRandom();
	});
}

//pre-setup function
window.onload = function() {
	document.getElementById('pause').onclick = function() {
		pause();
	}
	document.getElementById('start').onclick = function() {
		resume();
	}
	document.getElementById('reset').onclick = function() {
		setup();
	}
	document.getElementById('randomize').onclick = function() {
		randomize();
	}
	setup();
}