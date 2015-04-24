/**
 * 
 */
function GameManager() {
	this.dimension = 10;
	this.grid = new Grid(this.dimension);
	
	this.score = 0;
	this.round = 0;
	this.outcome = "";
	
	this.hero = null;
	this.killers = new Array();
	this.obstacles = new Array();
	this.treasures = new Array();
	this.cellsOccupied = new Array();// presented in x * 10 + y
}

GameManager.prototype.initGame = function () {
	
	$("description-container").onclick = function () {
		this.style.display = "none";
	}
	
	$("setup-panel").style.display = "block";
	$("play-panel").style.display = "none";
	
	$("end-setup").onclick = gameManager.proceedToPlayStage;
	$("end-play").onclick = gameManager.endByUser; // end condition 1

	$("stage").addEventListener("mousedown", setupEventListener, false);
	
	$("end-stage-container").onclick = function () {
		gameManager.restartGame();
	}
}

function setupEventListener(event) {
    if (!event) {
      var event = window.event;
    }
    var cell = event.target;
    console.log(event.target);
    var x = cell.cellIndex;
    var y = cell.parentNode.rowIndex;
    document.onkeydown = function(e) {
      // 
      if (gameManager.grid.cells[y][x]) {
        gameManager.errorMessage("This cell had been set and cannot be changed.");
        return false;
      }
      switch (e.keyCode) {
      case 72: gameManager.addHero(x, y); break;//h
      case 79: gameManager.addObstacle(x, y); break;//o
      case 75: gameManager.addKiller(x, y); break;//k
      case 49: gameManager.addTreasure(x, y, 1); break;//1
      case 50: gameManager.addTreasure(x, y, 2); break;//2
      case 51: gameManager.addTreasure(x, y, 3); break;//3
      case 52: gameManager.addTreasure(x, y, 4); break;//4
      case 53: gameManager.addTreasure(x, y, 5); break;//5
      case 54: gameManager.addTreasure(x, y, 6); break;//6
      case 55: gameManager.addTreasure(x, y, 7); break;//7
      case 56: gameManager.addTreasure(x, y, 8); break;//8
      case 57: gameManager.addTreasure(x, y, 9); break;//9
      default: gameManager.errorMessage("Please type a character in 1 to 9, \"h\", \"k\", and \"o\".");
      }
    };
  }

GameManager.prototype.errorMessage = function (msg) {
	alert(msg);
}

/*
 * start stage 
 */
GameManager.prototype.addHero = function (x, y) {
	console.log('addhero');
	if (!this.hero) {
		this.hero = new Hero(x, y);
		this.grid.addObject(this.hero);
	} else {
		this.errorMessage("You have set the hero.");
	}
}

GameManager.prototype.addKiller = function(x, y) {
	console.log('addkiller');
	var killer = new Killer(x, y);
	this.killers.push(killer);
	this.grid.addObject(killer);
}

GameManager.prototype.addObstacle = function(x, y) {
	console.log('addObstacle');
	var obstacle = new Obstacle(x, y);
	this.obstacles.push(obstacle);
	this.grid.addObject(obstacle);
}

GameManager.prototype.addTreasure = function(x, y, value) {
	console.log('addTreasure' + value);
	var treasure = new Treasure(x, y, value); 
	this.treasures.push(treasure);
	this.grid.addObject(treasure);
}

/*
 * play stage
 */
GameManager.prototype.proceedToPlayStage = function () {
	if (!gameManager.hero) {
		gameManager.errorMessage("A Hero must be placed.");
		return false;
	}

	// success
	$("setup-panel").style.display = "none";
	$("play-panel").style.display = "block";
	
	// no treasure set
	if (gameManager.treasures.length == 0) {
		gameManager.outcome = "win";
		gameManager.proceedToEndStage();
	}
	
	// if neither the hero nor the killers can move, game ends
	if (!gameManager.canAnyoneMove()) {
		gameManager.outcome = "draw";
		gameManager.proceedToEndStage();
	}
	
	document.onkeydown = null;
	$("stage").removeEventListener("mousedown", setupEventListener);
	document.onkeydown = function (e) {
		switch (e.keyCode) {
			case 65: gameManager.heroMoves("left"); break;//a(left)
			case 87: gameManager.heroMoves("up"); break;//w(up)
			case 68: gameManager.heroMoves("right"); break;//d(right)
			case 88: gameManager.heroMoves("down"); break;//x(down)
			default: gameManager.errorMessage("Please use \"a\" \"d\" \"w\" \"x\" to move the Hero.");
		}
	};

	// 
	for (var i=0; i<gameManager.obstacles.length; i++) {
		var item = gameManager.obstacles[i];
		var coordinateCode = item.x * 10 + item.y;
		gameManager.cellsOccupied.push(coordinateCode);
	}
}

GameManager.prototype.canAnyoneMove = function() {
	// can hero move
	var hero = this.hero;
	if (this.grid.canReach(hero.x+1, hero.y) && this.grid.canReach(hero.x-1, hero.y)  && this.grid.canReach(hero.x, hero.y+1)  && this.grid.canReach(hero.x, hero.y-1)) {
		return true;
	}

	// can killers move
	for (var j=0; j<this.killers.length; j++) {
		var surroundingCellsOfKiller = this.grid.surroundingCells(this.killers[j]);
		for (var k=0; k<surroundingCellsOfKiller.length; k++) {
			if (!(surroundingCellsOfKiller[k] instanceof Obstacle)) {
				return true;
			}
		}
	}
	return false;
}
		
GameManager.prototype.heroMoves = function(direction) {
	var hero = this.hero;
	var srcX = hero.x;
	var srcY = hero.y;
	var targetX = hero.x + (direction == "right" ? 1 : 0) - (direction == "left" ? 1 : 0);
	var targetY = hero.y + (direction == "down" ? 1 : 0) - (direction == "up" ? 1 : 0);
	if (!this.isMovable(targetX, targetY)) {
		this.computersTurn();
		return false;
	}
	// success move
	hero.movesTo(targetX, targetY);
	
	// is there a killer in the cell?
	if (this.grid.cells[targetY][targetX] instanceof Killer) {
		// end condition 4
		this.outcome = "lose";
		this.proceedToEndStage();
	}
	
	this.grid.moveObjectTo(srcX, srcY, targetX, targetY);
	
	// get treasure?
	for (var i=0; i<this.treasures.length; i++) {
		var treasure = this.treasures[i];
		if (treasure.x == targetX && treasure.y == targetY) {
			// delete from array
		    for (var j=0; j<this.treasures.length; j++)
		    {
		        if (this.treasures[j] === treasure)
		        {
		        	this.treasures.splice(j, 1);
		            break;
		        }
		    }
			// get points
			this.score += treasure.value;
			this.updateScore();
			console.log("get treasure(" + treasure.x + "," + treasure.y + ") value:" + treasure.value + ", total score:" + this.score);
			treasure.removeFromGrid();
			/*this.grid.removeObject(treasure.x, treasure.y);*/
			
			// no treasure left?
			if (this.treasures.length == 0) { // end condition 3
				this.outcome = "win";
				this.proceedToEndStage();
				return;
			}
			
			break;
		}
	}
	
	gameManager.computersTurn();
}

GameManager.prototype.isMovable = function(x, y) {
	var coordinateCode = x * 10 + y;
	for (var i=0; i<gameManager.cellsOccupied.length; i++) {
		if (gameManager.cellsOccupied[i] == coordinateCode) {
			gameManager.errorMessage("The cell is occupied by a Obstacle.");
			return false;
		}
	}
	if (x < 0 || x > gameManager.dimension-1 || y < 0 || y > gameManager.dimension-1) {
		gameManager.errorMessage("Our Hero cannot move outside the grid.");
		return false;
	}
	return true;
}

GameManager.prototype.updateScore = function() {
	$("score").innerHTML = gameManager.score;
}

GameManager.prototype.roundEnds = function() {
	this.round++;
	$("round").innerHTML = this.round;
}

GameManager.prototype.computersTurn = function() {
	var hero = gameManager.hero;
	outerloop:
	for (var i=0; i<gameManager.killers.length; i++) {
		var killer = gameManager.killers[i];
		/* 
		 * hunt for hero
		 */

		innerloop:
		for (var j=killer.x-1; j<=killer.x+1; j++) {
			if (j < 0 || j > this.dimension - 1) {
				continue;
			}
			for (var k=killer.y-1; k<=killer.y+1; k++){
				if (k < 0 || k > this.dimension - 1) {
					continue;
				}
				if (j == killer.x && k == killer.y) {
					continue;
				}
				var cell = gameManager.grid.cells[k][j];
				if (cell instanceof Hero) {
					// kill hero
					this.killerMoves(killer, cell.x, cell.y);
					this.roundEnds();
					this.outcome = "lose";
					this.proceedToEndStage(); // end condition 2
					return;
				} else if (cell instanceof Treasure) {
					// destroy treasure
					var treasure = cell;
					for (var j=0; j<this.treasures.length; j++)
				    {
				        if (this.treasures[j] === treasure)
				        {
				        	this.treasures.splice(j, 1);
				            break;
				        }
				    }
					console.log("destroy treasure(" + treasure.x + "," + treasure.y + ") value:" + treasure.value + ", total score:" + this.score);
					treasure.removeFromGrid();
					this.grid.removeObject(treasure.x, treasure.y);
					this.killerMoves(killer, cell.x, cell.y);
					// no treasure left?
					if (this.treasures.length == 0) { // end condition 3
						this.outcome = "win";
						this.proceedToEndStage();
					}
					break outerloop;
				} else if (cell instanceof Obstacle) {
					// do nothing
				} else if (cell instanceof Killer) {
					// do nothing
				} else if (cell == null) {
					// do nothing
				}
			}
		}
		
		// A-star path finding
		var grid = this.grid.simpleGrid();
		var pathfinding = new AstarPathFinding(grid, false);
		var point = pathfinding.findPath(new Point(this.hero.x, this.hero.y), new Point(killer.x, killer.y));
		if (point) {
			// maybe the cell is occupied by a killer
			var target = point.parentPoint;
			var isTargetCellOccupiedByKiller = false;
			for (var j = 0; j < this.killers.length; j++) {
				if (target.x == this.killers[j].x && target.y == this.killers[j].y) {
					isTargetCellOccupiedByKiller = true;
					break;
				}
			}
			// if the cell is occupied by a killer, re-computer the path with this killer
			if (isTargetCellOccupiedByKiller) {
				grid[target.y][target.x] = 1;
				var pathfindingWithKiller = new AstarPathFinding(grid, false);
				var pointWithKiller = pathfindingWithKiller.findPath(new Point(this.hero.x, this.hero.y), new Point(killer.x, killer.y));
				if (pointWithKiller) {
					var targetWithKiller = pointWithKiller.parentPoint;
					// make sure this move does not digress
					var movement = (Math.abs(pointWithKiller.x - killer.x) + Math.abs(pointWithKiller.y - killer.y) == 2) ? 14 : 10;
					if (targetWithKiller.F < target.F + movement) {
						// success move
						this.killerMoves(killer, targetWithKiller.x, targetWithKiller.y);
					}
				}
			} else {
				// success move
				this.killerMoves(killer, target.x, target.y);
			}
		} else {
			// path blocked, do nothing
		}
	} // end killers for-loop

	this.roundEnds();
}

GameManager.prototype.killerMoves = function(killer, x, y) {
	this.grid.moveObjectTo(killer.x, killer.y , x, y);
	killer.movesTo(x, y);
}

GameManager.prototype.endByUser = function() {
	gameManager.outcome = "lose";
	gameManager.proceedToEndStage();
}

/*
 * end stage
 */
GameManager.prototype.proceedToEndStage = function () {
	document.onkeydown = null;
	if (this.outcome == "win") {
		$("outcome").innerHTML = "You win!";
	} else if (this.outcome == "lose") {
		$("outcome").innerHTML = "Computer win!";
	} else if (this.outcome == "draw") {
		$("outcome").innerHTML = "Draw!";
	}
	$("end-stage-container").style.display = "block";
}

GameManager.prototype.restartGame = function () {
	$("end-stage-container").style.display = "none";
	$("setup-panel").style.display = "block";
	$("play-panel").style.display = "none";
	$("stage").addEventListener("mousedown", setupEventListener, false);
	
	this.hero.removeFromGrid();
	for (var i=0; i<this.killers.length; i++) {
		this.killers[i].removeFromGrid();
	}
	for (var j=0; j<this.obstacles.length; j++) {
		this.obstacles[j].removeFromGrid();
	}
	for (var k=0; k<this.treasures.length; k++) {
		this.treasures[k].removeFromGrid();
	}
	
	this.hero = null;
	this.killers = new Array();
	this.obstacles = new Array();
	this.treasures = new Array();
	this.cellsOccupied = new Array();
	this.grid = new Grid(this.dimension);
	
	this.score = 0;
	this.round = 0;
	this.outcome = "";
	$("score").innerHTML = "0";
	$("round").innerHTML = "0";
}