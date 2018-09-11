var canvas, ctx, image_data;
var height, width;

var julia_helper;
var MAX_ITER = 90;

var final_x_min, final_x_max;
var final_y_min, final_y_max;
var rescale_x_min, rescale_y_min;
var rescale_x_max, rescale_y_max;

function setup() {
	//setup logic
	canvas = document.getElementById("canvas1");
	ctx = canvas.getContext("2d");
	height = canvas.height;
	width = canvas.width;

	julia_helper = new Julia(MAX_ITER);

	image_data = ctx.createImageData(width, height);

	window.requestAnimationFrame(draw);
}

function draw() {

	var user_x_min = parseInt(document.getElementById('minx').value);
	var user_x_max = parseInt(document.getElementById('maxx').value);
	var user_y_min = parseInt(document.getElementById('miny').value);
	var user_y_max = parseInt(document.getElementById('maxy').value);
	var user_exp   = parseInt(document.getElementById('exp').value);

	final_x_min = user_x_min ? user_x_min : -2.5;
	final_x_max = user_x_max ? user_x_max : 1;
	final_y_min = user_y_min ? user_y_min : -1;
	final_y_max = user_y_max ? user_y_max : 1; 
	var final_exp   = user_exp   ? user_exp   : 2;

	drawFrame(final_x_min, final_x_max, final_y_min, final_y_max, final_exp);
	// drawFrame(-2.5,1,-1,1);
}

function drawFrame(x_min, x_max, y_min, y_max, exp) {

	ctx.clearRect(0,0,width,height);

	for(var x=0; x <=width; x++) {
		for(var y=0; y<= height; y++) {
			var scaled_x = linearMap(x, 0, width, x_min, x_max);
			var scaled_y = linearMap(y, 0, height, y_min, y_max);

			var iter = julia_helper.calculateColor(scaled_x,scaled_y, exp);

			if(iter < MAX_ITER){
				red_pixel_val =  linearMap(iter, 0, MAX_ITER, 0, 255);
				blue_pixel_val = linearMap(iter, 0, MAX_ITER, 100,255);
				setPixel(image_data, x, y, red_pixel_val, blue_pixel_val, 60, 255);
			} else {
				// console.log("("+x+","+y+")  trapped");
				setPixel(image_data, x, y, 0, 0, 0, 255);
			}
		}
		var pct_done = x/(width*1.0)*100;
		console.log(pct_done + "% done");
		document.getElementById('progress').textContent = pct_done.toString().substring(0,4) + "% done";
	}

	ctx.putImageData(image_data,0,0);
}


function setPixel(image, x, y, r, g, b, a) {
	index = (x + y*image.width)*4; //index of pixel data at (x,y)

	image.data[index+0]=r;
	image.data[index+1]=g;
	image.data[index+2]=b;
	image.data[index+3]=a;
}

function linearMap (num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function click_handler(e) {
	var xoff = canvas.offsetLeft;
	var yoff = canvas.offsetTop;

	var relx = Math.floor((e.x - xoff));
	var rely = Math.floor((e.y - yoff));

	var res = {
		x: relx,
		y: rely
	}

	return res;
}

window.onload = function() {
	document.getElementById('start').onclick = function() { 
		setup();
	}

	document.getElementById('canvas1').onmousedown = function(e) {
		var pos = click_handler(e);
		rescale_x_min = linearMap(pos.x, 0, width, final_x_min, final_x_max);
		rescale_y_min = linearMap(pos.y, 0, height, final_y_min, final_y_max);
	}

	document.getElementById('canvas1').onmouseup = function(e) {
		var pos = click_handler(e);
		rescale_x_max = linearMap(pos.x, 0, width, final_x_min, final_x_max);
		rescale_y_max = linearMap(pos.y, 0, height, final_y_min, final_y_max);

		console.log("rescaling to (" + rescale_x_min + "," + rescale_x_max + ")x(" + rescale_y_min + "," + rescale_y_max);

		//update the final values
		final_x_min = rescale_x_min;
		final_x_max = rescale_x_max;
		final_y_min = rescale_y_min;
		final_y_max = rescale_y_max;

		drawFrame(rescale_x_min, rescale_x_max, rescale_y_min, rescale_y_max, exp);
	}


}