var current_frame;
var canvas;
var ctx;
var width, height; //px per cell
var scale = 5;
var frames_per_second=60;

var max_x;
var max_y;

var cell_factory;

function setup() {
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

	//instantiate cell factory
	cell_factory = new CellFactory(max_x, max_y);


	current_frame = window.requestAnimationFrame(draw);
}

function draw() {
	//called every frame
	setTimeout(function() {

		cell_factory.update();
		var current_state = cell_factory.getCurrentState();

		ctx.clearRect(0, 0, width, height);

		for(var x = 0; x < current_state.length; x++) {
			for(var y = 0; y < current_state[x].length; y++) {
				if(current_state[x][y].isAlive()) {
					ctx.beginPath();
					ctx.fillStyle = "#000000";
					ctx.rect(x*scale+1, y*scale+1, scale-2, scale-2);
					ctx.fill();
					ctx.closePath();
				}
			}
		}


		current_frame = window.requestAnimationFrame(draw);
	}, 1000/frames_per_second);
}

function add_cell(x,y) {
	cells.push(new Cell(x,y));
}





function pause() {
	if(current_frame) {
		window.cancelAnimationFrame(current_frame);
	}
}

function resume() {
	draw();
}

//pre-setup function
window.onload = function() {
	setup();
}