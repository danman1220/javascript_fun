var g;
var m1;
var m2;
var l1;
var l2;
var speed;

var simulations = new Array();
var playing = false;

class pendulumSimulation {

    constructor(canvasID) {

        this.MAX_MEM = 1000;
        this.STEPS_PER_FRAME = 500;

        this.stepscl = 1/(60*this.STEPS_PER_FRAME); //seconds per step (converts derivatives wrt seconds to frames)
        this.px_per_m = 60;	//default 100
        this.x1;
        this.y1;

        this.x2;
        this.y2;

        this.currentFrame;

        this.prev_pos = new Array();

        this.canvas = document.getElementById("canvas"+canvasID);
        this.ctx = this.canvas.getContext("2d");
        this.height = this.canvas.height;
        this.width = this.canvas.width;

        this.ctx.setTransform(1,0,0,1,0,0);
        this.ctx.clearRect(0,0,this.width,this.height);

        this.ctx.translate(this.width/2,this.height/2);

        // a1 = Math.PI/3+0.001; //initial angle
        // a1_v = 1; //initial angular velocity
        // a2 = Math.PI;
        // a2_v = -3;
        this.a1 = parseFloat(document.getElementById('a1').value);
        this.a2 = parseFloat(document.getElementById('a2').value);
        this.a1_v = parseFloat(document.getElementById('a1_v').value);
        this.a2_v = parseFloat(document.getElementById('a2_v').value);

        var da1 = parseFloat(document.getElementById('da1').value);
        var da2 = parseFloat(document.getElementById('da2').value);

        //ugly offset hardcode
        if(canvasID % 3 == 1){
            this.a1 -=da1;
        } else if(canvasID %3 ==0) {
            this.a1+= da1;
        }

        if(canvasID <= 3){
            this.a2 -=da2;
        } else if(canvasID >=7){
            this.a2 +=da2;
        }
    }

    drawOne() {

        for(var i=0; i < this.STEPS_PER_FRAME; i++){
            this.calculatePos();
        }


        this.prev_pos.push([this.x2,this.y2]);
            if (this.prev_pos.length > this.MAX_MEM){
                this.prev_pos = this.prev_pos.slice(1);
            }

        //draw result
        this.ctx.clearRect(-this.width,-this.height,this.width*2,this.height*2);
        this.ctx.beginPath();
        this.ctx.moveTo(0,0)
        this.ctx.lineTo(this.x1*this.px_per_m,this.y1*this.px_per_m);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.moveTo(this.x1*this.px_per_m,this.y1*this.px_per_m)
        this.ctx.lineTo(this.x2*this.px_per_m,this.y2*this.px_per_m);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(this.x1*this.px_per_m,this.y1*this.px_per_m,m1/4,0,Math.PI*2);
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(this.x2*this.px_per_m,this.y2*this.px_per_m,m2/4,0,Math.PI*2);
        this.ctx.fill();
        this.ctx.closePath();

        for(var i = 0; i < this.prev_pos.length-1; ++i){
            this.ctx.beginPath();
            this.ctx.moveTo(this.prev_pos[i][0]*this.px_per_m,this.prev_pos[i][1]*this.px_per_m);
            this.ctx.lineTo(this.prev_pos[i+1][0]*this.px_per_m,this.prev_pos[i+1][1]*this.px_per_m);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    draw() {

        for(var i=0; i < this.STEPS_PER_FRAME; i++){
            this.calculatePos();
        }


        this.prev_pos.push([this.x2,this.y2]);
            if (this.prev_pos.length > this.MAX_MEM){
                this.prev_pos = this.prev_pos.slice(1);
            }

        //draw result
        this.ctx.clearRect(-this.width,-this.height,this.width*2,this.height*2);
        this.ctx.beginPath();
        this.ctx.moveTo(0,0)
        this.ctx.lineTo(this.x1*this.px_per_m,this.y1*this.px_per_m);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.moveTo(this.x1*this.px_per_m,this.y1*this.px_per_m)
        this.ctx.lineTo(this.x2*this.px_per_m,this.y2*this.px_per_m);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(this.x1*this.px_per_m,this.y1*this.px_per_m,m1/4,0,Math.PI*2);
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.arc(this.x2*this.px_per_m,this.y2*this.px_per_m,m2/4,0,Math.PI*2);
        this.ctx.fill();
        this.ctx.closePath();

        for(var i = 0; i < this.prev_pos.length-1; ++i){
            this.ctx.beginPath();
            this.ctx.moveTo(this.prev_pos[i][0]*this.px_per_m,this.prev_pos[i][1]*this.px_per_m);
            this.ctx.lineTo(this.prev_pos[i+1][0]*this.px_per_m,this.prev_pos[i+1][1]*this.px_per_m);
            this.ctx.stroke();
            this.ctx.closePath();
        }

       this.currentFrame = window.requestAnimationFrame(this.draw.bind(this));
    }

    pause() {
        if(this.currentFrame){
            window.cancelAnimationFrame(this.currentFrame);
        }
    }

    calculatePos() {	
        var yf = solver.rk4(0,[this.a1,this.a2,this.a1_v,this.a2_v], diffeq, this.stepscl);
        
        //hack to turn off diffeq solver TODO remove
        if(g != 0) {

            this.a1 = yf[0];
            this.a2 = yf[1];
            this.a1_v = yf[2];
            this.a2_v = yf[3];
        } else {
            this.a1 += this.a1_v*this.stepscl;
            this.a2 += this.a2_v*this.stepscl;
        }

        //calculate x and y values

        this.x1 = l1*Math.sin(this.a1);
        this.y1 = l1*Math.cos(this.a1);

        this.x2 = this.x1 + l2*Math.sin(this.a2);
        this.y2 = this.y1 + l2*Math.cos(this.a2);

    }

    //calculateAccel() {
    //    //update angle with diffy q
    //    var num1 = -g*(2*m1+m2)*Math.sin(a1);
    //    var num2 = -m2*g*Math.sin(a1-2*a2);
    //    var num3 = -2*Math.sin(a1-a2)*m2*(a2_v*a2_v*l2 + a1_v*a1_v*l1*Math.cos(a1-a2));
    //    var den = l1*(2*m1 + m2 - m2*Math.cos(2*a1 - 2*a2))

    //    a1_a = (num1 + num2 + num3)/den;

    //    num1 = 2*Math.sin(a1-a2);
    //    num2 = a1_v*a1_v*l1*(m1+m2);
    //    num3 = g*(m1+m2)*Math.cos(a1);
    //    var num4 = a2_v*a2_v*l2*m2*Math.cos(a1-a2);
    //    den = l2*(2*m1 + m2 - m2*Math.cos(2*a1-2*a2))

    //    a2_a = (num1*(num2 + num3 + num4))/den
    //}
}

window.onload = function(){
    m1 = parseFloat(document.getElementById('m1').value);
    m2 = parseFloat(document.getElementById('m2').value);
    l1 = parseFloat(document.getElementById('l1').value);
    l2 = parseFloat(document.getElementById('l2').value);
    g = parseFloat(document.getElementById('g').value);

    //yes, I'm hardcoding in the nine canvases
    if(simulations.length < 1) {
        for(var i=1; i<=9; i++) {
            simulations.push(new pendulumSimulation(i))
        }
    }

	var simStart = document.getElementById("reset");
    simStart.onclick = function() {
        for(var i=0; i<simulations.length; i++) {
            simulations[i].pause();
        }

        //hacky delete of array without killing references
        simulations.length = 0;
        //yes, I'm hardcoding in the nine canvases
        for(var i=1; i<=9; i++) {
            simulations.push(new pendulumSimulation(i))
        }
        playing=false;

        for(var i=0; i < simulations.length; i++) {
            simulations[i].drawOne();
        }
    };
    
    var playSim = document.getElementById("play");
    playSim.onclick = function() {
        if(playing==false){
            for(var i=0; i < simulations.length; i++) {
                simulations[i].draw();
            }
            playing=true;
        }
    }
    
    var pauseSim = document.getElementById("pause");
    pauseSim.onclick = function() {
        for(var i=0; i<simulations.length; i++) {
            simulations[i].pause();
        }
        playing=false;
    }

    for(var i=0; i < simulations.length; i++) {
        simulations[i].drawOne();
    }

}
