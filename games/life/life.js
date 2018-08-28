function Cell() {
	//cell logic here
	this.dead = true;
	this.dead_next = true;
	this.neighbors = [];


	this.update = function() {
		this.dead = this.dead_next;
	}

	this.addNeighbor = function(cell) {
		this.neighbors.push(cell)
	}

	this.calculateNext = function() {
		var live_neighbors = 0;
		for(var i = 0; i < this.neighbors.length; i++) {
			if(this.neighbors[i].isAlive()) {
				live_neighbors++;
			}
		}

		if(this.isAlive()) {
			if(live_neighbors < 2) {
				this.killNext(); //underpopulated
			} else if(live_neighbors > 3) {
				this.killNext(); //overpopulated
			} else {
				this.reviveNext();
			}

		} else {
			if(live_neighbors === 3) {
				this.reviveNext();
			} else {
				this.killNext();
			}
		}
	}

	this.reviveNext = function() {
		this.dead_next = false;
	}

	this.create = function() {
		this.dead_next = false;
		this.dead = false;
	}

	this.killNext = function() {
		this.dead_next = true;
	}

	this.isAlive = function() {
		return !this.dead;
	}
}


function CellFactory(max_x, max_y) {
	//builds cells and keeps track of positions

	//initialize array
	this.all_cells = new Array(max_x+1);
	for (var i = 0; i < this.all_cells.length; i++){
		this.all_cells[i] = new Array(max_y+1);

		for (var j = 0; j < this.all_cells[i].length; j++) {
			this.all_cells[i][j] = new Cell();
		}
	}

	//fill with dead cells and keep track of neighbors
	for (var i = 0; i <= max_x; i++){
		for (var j = 0; j <= max_y; j++){
			if(j<max_y){
				if(i>0) {
					this.all_cells[i][j].addNeighbor(this.all_cells[i-1][j+1]);
				}
				this.all_cells[i][j].addNeighbor(this.all_cells[i  ][j+1]);
				if(i<max_x) {
					this.all_cells[i][j].addNeighbor(this.all_cells[i+1][j+1]);
				}
			}

			if(i>0){
				this.all_cells[i][j].addNeighbor(this.all_cells[i-1][j  ]);
			}
			if(i<max_x){
				this.all_cells[i][j].addNeighbor(this.all_cells[i+1][j  ]);
			}
			if(j>0){
				if(i>0){
					this.all_cells[i][j].addNeighbor(this.all_cells[i-1][j-1]);
				}
				this.all_cells[i][j].addNeighbor(this.all_cells[i  ][j-1]);
				if(i<max_x){
					this.all_cells[i][j].addNeighbor(this.all_cells[i+1][j-1]);
				}
			}
		}
	}


	this.update = function() {
		for (var x = 0; x < this.all_cells.length; x++) {
			for (var y = 0; y < this.all_cells[x].length; y++) {
				this.all_cells[x][y].calculateNext();
			}
		}

		for (var x = 0; x < this.all_cells.length; x++) {
			for (var y = 0; y < this.all_cells[x].length; y++) {
				this.all_cells[x][y].update();
			}
		}
	}

	this.reviveCell = function(x,y) {
		this.all_cells[x][y].reviveNext();
	}

	this.getCurrentState = function() {
		return this.all_cells.slice(); //prevents all_cells from mutating, just returns current state
	}

	this.initializeRandom = function() {
		for (var x = 0; x < this.all_cells.length; x++) {
			for (var y = 0; y < this.all_cells[x].length; y++) {
				if(Math.random() > 0.5) {
					this.all_cells[x][y].create();
				}
			}
		}
	}

	this.initializeLine = function(x) {
		for (var y = 0; y < this.all_cells[x].length; y++) {
			this.all_cells[x][y].create();
		}
	}


}