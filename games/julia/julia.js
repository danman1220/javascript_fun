function Julia(max_iterations) {
	this.exp = parseInt(exp) ? parseInt(exp) : 2;
	this.max_iterations = max_iterations;

	this.calculateColor = function(x0,y0, exp) {
		var exponent = parseInt(exp) ? parseInt(exp) : 2;

		var iterations = 0;

		var pt = new Complex(x0,y0);
		
		var initial = new Complex(0,0);

		while(initial.normSquared < 2*2 && iterations < this.max_iterations) {
			initial = initial.power(exponent).add(pt);
			iterations++;
		}


		// var x = 0; //initial point for iteration (critical pt)
		// var y = 0

		// while(x*x + y*y < 2*2 && iterations < this.max_iterations) {
		// 	var new_x = x*x - y*y + x0; //compute z^2 + z0
		// 	var new_y = 2*x*y + y0;

		// 	x = new_x;
		// 	y = new_y;
		// 	iterations++;
		// }
		return iterations;
	}

	// this.complexMultiply = function(z1, z2) {
	// 	var re = z1.x * z2.x - z1.y * z2.y;
	// 	var im = z1.x * z2.y + z1.y * z2.x;
	// 	var res = {
	// 		x: re,
	// 		y: im
	// 	}
	// 	return res;
	// }

	// this.complexPower = function(z, pow) {
	// 	if(pow === 1) {
	// 		return z;
	// 	} else if(pow === 2) {
	// 		return this.complexMultiply(z,z);
	// 	} else if(pow > 2) {
	// 		return this.complexMultiply(z,this.complexPower(z,pow-1));
	// 	}
	// }
}


function Complex(x,y) {
	this.x = x;
	this.y = y;
	this.normSquared = this.x*this.x + this.y*this.y;
}

Complex.prototype.add = function(z) {
	var re = this.x + z.x;
	var im = this.y + z.y;
	return new Complex(re, im);
}

Complex.prototype.multiply = function(z) {
	var re = this.x * z.x - this.y * z.y;
	var im = this.x * z.y + this.y * z.x;
	return new Complex(re, im);
}

Complex.prototype.power = function(pow) {
	if(pow === 1) {
			return this;
	} else if(pow === 2) {
		return this.multiply(this);
	} else if(pow > 2) {
		return this.multiply(this.power(pow-1));
	}
}