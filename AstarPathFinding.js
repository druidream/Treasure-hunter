/**
 * 
 */
function AstarPathFinding(grid, isIgnoreCorner) {
	this.STEP = 10;
	this.OBLIQUE = 14;
	
	this.grid = grid;
	this.isIgnoreCorner = isIgnoreCorner;
	
	this.openList = new Array();
	this.closeList = new Array();
}

AstarPathFinding.prototype.findPath = function (start, end) {
	this.openList.push(start);
	while (this.openList.length != 0) {
		// find the point with min F value
		var tempStart = this.openList.minPoint();
		this.openList.shift();
		this.closeList.push(tempStart);
		// find its surrounding points
		var surroundPoints = this.surroundPoints(tempStart, this.isIgnoreCorner);
		for (var i = 0; i < surroundPoints.length; i++) {
			var point = surroundPoints[i];
			if (this.openList.isPointExists(point)) {
				//foundPoint(tempStart, point);
				var newG = tempStart.G + (tempStart.x == point.x || tempStart.y == point.y) ? this.STEP : this.OBLIQUE;
				if (newG < point.G) {
					point.parentPoint = tempStart;
					point.G = newG;
					point.calcF();
				}
			} else {
				//notFoundPoint(tempStart, end, point);
				point.parentPoint = tempStart;
				point.G = this.calcG(tempStart, point);
				point.H = this.calcH(end, point);
				point.calcF();
				this.openList.push(point);
			}
		}
		if (this.openList.get(end) != null)
			return this.openList.get(end);
	}
	return this.openList.get(end);
}

AstarPathFinding.prototype.surroundPoints = function (point, isIgnoreCorner) {
	var surroundPoints = new Array();
	
	for (var j = point.x - 1; j <= point.x + 1; j++) {
		for (var k = point.y - 1; k <= point.y + 1; k++){
			if (this.canReach(point, j, k, isIgnoreCorner)) {
				surroundPoints.push(new Point(j, k));
			}
		}
	}
	return surroundPoints;
}

AstarPathFinding.prototype.canReach = function (start, x, y, isIgnoreCorner) {

    if (!this.isPointNotOccupied(x, y) || this.closeList.isPointExists(new Point(x, y)))
        return false;
    else
    {
        if (Math.abs(x - start.x) + Math.abs(y - start.y) == 1)
            return true;
        else
        {
            if (this.isPointNotOccupied(start.x, y) && this.isPointNotOccupied(x, start.y))
                return true;
            else
                return isIgnoreCorner;
        }
    }
}

AstarPathFinding.prototype.isPointNotOccupied = function (x, y) {
	if (x > this.grid.length - 1 || x < 0 || y > this.grid.length - 1 || y < 0) {
		return false;
	}
    return this.grid[y][x] == 0;
}

AstarPathFinding.prototype.calcG = function (start, point) {
	var G = (Math.abs(point.x - start.x) + Math.abs(point.y - start.y)) == 2 ? this.OBLIQUE : this.STEP;
    var parentG = point.parentPoint != null ? point.parentPoint.G : 0;
    return G + parentG;
}

AstarPathFinding.prototype.calcH = function (end, point) {
    var step = Math.abs(point.x - end.x) + Math.abs(point.y - end.y);
    return step * this.STEP;
}

/**
 * Point class
 */
function Point(x, y) {
	this.x = x;
	this.y = y;
	this.F = 0;
	this.G = 0;
	this.H = 0;
	this.parentPoint = null;
	this.calcF = function () {
		this.F = this.G + this.H;
	}
}

/**
 * array util
 */
Array.prototype.removeElement = function(index) {
	if (index < 0)
		return this;
	return this.slice(0, index).concat(this.slice(index + 1, this.length));
}

Array.prototype.isPointExists = function (point) {
	for (var i = 0; i < this.length; i++) {
		if ((this[i].x == point.x) && (this[i].y == point.y)) {
			return true;
		}
	}
	return false;
}

Array.prototype.get = function (point) {
	for (var i = 0; i < this.length; i++) {
		if ((this[i].x == point.x) && (this[i].y == point.y)) {
			return this[i];
		}
	}
	return null;
}

Array.prototype.minPoint = function () {
	this.sort(function(pointA, pointB){
		return pointA.F - pointB.F;
	});
	return this[0];
}
