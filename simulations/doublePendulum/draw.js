var canvas; 
var ctx;
var height;
var width;
var currentFrame;

var a1; //angle global
var a1_v; //angular velocity global
var a2;
var a2_v;


var prev_pos = new Array();
var MAX_MEM = 5000;

var STEPS_PER_FRAME = 500;

var g = 9.8; //gravity constant m/s^2

var stepscl = 1/(60*STEPS_PER_FRAME); //seconds per step (converts derivatives wrt seconds to frames)
var px_per_m = 100;	//default 100

function setup() {

	if(currentFrame){
		window.cancelAnimationFrame(currentFrame);
	}

	canvas = document.getElementById("canvas1");
	ctx = canvas.getContext("2d");
	height = canvas.height;
	width = canvas.width;

	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0,0,width,height);

	ctx.translate(width/2,height/2);

	// a1 = Math.PI/3+0.001; //initial angle
	// a1_v = 1; //initial angular velocity
	// a2 = Math.PI;
	// a2_v = -3;
	a1 = parseFloat(document.getElementById('a1').value);
	a2 = parseFloat(document.getElementById('a2').value);
	a1_v = parseFloat(document.getElementById('a1_v').value);
	a2_v = parseFloat(document.getElementById('a2_v').value);
	m1 = parseFloat(document.getElementById('m1').value);
	m2 = parseFloat(document.getElementById('m2').value);
	l1 = parseFloat(document.getElementById('l1').value);
	l2 = parseFloat(document.getElementById('l2').value);
	g = parseFloat(document.getElementById('g').value);

	prev_pos = new Array();

	currentFrame = window.requestAnimationFrame(draw);
}

function draw() {

	for(var i=0; i < STEPS_PER_FRAME; i++){
		calculatePos();
	}


	prev_pos.push([x2,y2]);
		if (prev_pos.length > MAX_MEM){
			prev_pos = prev_pos.slice(1);
		}

	energy1 = 0.5*m1*l1*l1*a1_v*a1_v + m1*g*(y1)
	energy2 = 0.5*m2*l2*l2*a2_v*a2_v + m2*g*(y2)
	// console.log("total energy = "+(energy1+energy2))

	//draw result
	ctx.clearRect(-width,-height,width*2,height*2);
	ctx.beginPath();
	ctx.moveTo(0,0)
	ctx.lineTo(x1*px_per_m,y1*px_per_m);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(x1*px_per_m,y1*px_per_m)
	ctx.lineTo(x2*px_per_m,y2*px_per_m);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(x1*px_per_m,y1*px_per_m,m1/2,0,Math.PI*2);
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(x2*px_per_m,y2*px_per_m,m2/2,0,Math.PI*2);
	ctx.fill();
	ctx.closePath();

	for(var i = 0; i < prev_pos.length-1; ++i){
		ctx.beginPath();
		ctx.moveTo(prev_pos[i][0]*px_per_m,prev_pos[i][1]*px_per_m);
		ctx.lineTo(prev_pos[i+1][0]*px_per_m,prev_pos[i+1][1]*px_per_m);
		ctx.stroke();
		ctx.closePath();
	}

	currentFrame = window.requestAnimationFrame(draw);
}

function calculatePos() {	
	yf = solver.rk4(0,[a1,a2,a1_v,a2_v], diffeq, stepscl);
	
	if(g != 0) {

		a1 = yf[0];
		a2 = yf[1];
		a1_v = yf[2];
		a2_v = yf[3];
	} else {
		a1 += a1_v*stepscl;
		a2 += a2_v*stepscl;
	}

	//calculate x and y values

	x1 = l1*Math.sin(a1);
	y1 = l1*Math.cos(a1);

	x2 = x1 + l2*Math.sin(a2);
	y2 = y1 + l2*Math.cos(a2);

}

function calculateAccel() {
	//update angle with diffy q
	var num1 = -g*(2*m1+m2)*Math.sin(a1);
	var num2 = -m2*g*Math.sin(a1-2*a2);
	var num3 = -2*Math.sin(a1-a2)*m2*(a2_v*a2_v*l2 + a1_v*a1_v*l1*Math.cos(a1-a2));
	var den = l1*(2*m1 + m2 - m2*Math.cos(2*a1 - 2*a2))

	a1_a = (num1 + num2 + num3)/den;

	num1 = 2*Math.sin(a1-a2);
	num2 = a1_v*a1_v*l1*(m1+m2);
	num3 = g*(m1+m2)*Math.cos(a1);
	var num4 = a2_v*a2_v*l2*m2*Math.cos(a1-a2);
	den = l2*(2*m1 + m2 - m2*Math.cos(2*a1-2*a2))

	a2_a = (num1*(num2 + num3 + num4))/den
}

window.onload = function(){
	var simStart = document.getElementById("reset");
	simStart.onclick = setup;
	setup();
}