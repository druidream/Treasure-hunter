/**
 * 
 */
function Grid(dimension) {
	this.dimension = dimension;
	this.cells = new Array(dimension);
	for (var i=0; i<dimension; i++) {
		this.cells[i] = new Array(dimension);
		for (var j=0; j<dimension; j++) {
			this.cells[i][j] = null;
		}
	}
}

Grid.prototype.addObject = function (obj) {
	this.cells[obj.y][obj.x] = obj;
}

Grid.prototype.removeObject = function (x, y) {
	this.cells[y][x] = null;
}

Grid.prototype.moveObjectTo = function (srcX, srcY, targX, targY) {
	this.cells[targY][targX] = this.cells[srcY][srcX];
	this.cells[srcY][srcX] = null;
}

Grid.prototype.surroundingCells = function (cell) {
	var result = new Array();
	
	for (var j=cell.x-1; j<=cell.x+1; j++) {
		if (j < 0 || j > this.dimension - 1) {
			continue;
		}
		for (var k=cell.y-1; k<=cell.y+1; k++){
			if (k < 0 || k > this.dimension - 1) {
				continue;
			}
			if (j == cell.x && k == cell.y) {
				continue;
			}
			result.push(this.cells[k][j]);
		}
	}
	
	return result;
}

Grid.prototype.printGrid = function () {
	var log = "";
	for (var i=0; i<this.cells.length; i++) {
		for (var j=0; j<this.cells[i].length; j++) {
			var cell = this.cells[i][j];
			if (cell instanceof Hero) {
				log += "H ";
			} else if (cell instanceof Killer) {
				log += "K ";
			} else if (cell instanceof Obstacle) {
				log += "O ";
			} else if (cell instanceof Treasure) {
				log += cell.value + " ";
			} else {
				log += ". ";
			}
		}
		log += "\n";
	}
	console.log(log);
}