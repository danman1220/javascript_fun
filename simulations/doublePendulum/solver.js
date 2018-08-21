var solver = {

	rk2: function(ti, yi, matrix, step) {

		k1 = matrix(ti,yi).map(x=>step*x);		
		var y2 = this.vector_add(yi, k1.map(x => x*0.5));

		k2 = matrix(ti + 0.5*step, y2).map(x=>x*step);
		var yf = this.vector_add(yi,k2);

		return yf;
	},

	rk4: function(ti, yi, matrix, step) {

		k1 = matrix(ti,yi).map(x=>step*x);
		var y2 = this.vector_add(yi, k1.map(x => x*0.5));

		k2 = matrix(ti + 0.5*step, y2).map(x=>x*step);
		var y3 = this.vector_add(yi, k2.map(x => x*0.5));

		k3 = matrix(ti + 0.5*step, y2).map(x=>x*step);
		var y4 = this.vector_add(yi, k3);

		k4 = matrix(ti + step, y4).map(x=>step*x);

		var yf = this.vector_add(yi,k1.map(x=>x/6.0), k2.map(x=>x/3.0), k3.map(x=>x/3.0), k4.map(x=>x/6.0));
		return yf;
	},

	vector_add: function() {
		var that = this;

		if(arguments.length === 2){
			var res = new Array();
			var x = arguments[0];
			var y = arguments[1];

			// add vectors componentwise
			//TODO more error handling? what if x, y arent arrays?
			for(var i=0; i<x.length; i++){
				res[i] = x[i] + y[i];
			}
			return res;	

		} else if(arguments.length > 2) {
			return that.vector_add(arguments[0], that.vector_add.apply(that, Array.apply(null, arguments).slice(1)));
		
		} else {
			//should never happen... 
			console.log("don't add single vectors");
		}
	},

}