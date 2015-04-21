/**
 * 
 */
function Obstacle(x, y) {
	this.x = x;
	this.y = y;
	
	var div = document.createElement("div");
	div.className = "cell obstacle";
	div.style.position = "absolute";
	//div.innerHTML = "O";
	$("stage").appendChild(div);
	
	this.div = div;
	
	this.render(x, y);
}


Obstacle.prototype.render = function(x, y) {
	this.div.style.left = (36 * x + 1) + "px";
	this.div.style.top = (36 * y + 1) + "px";
}

Obstacle.prototype.removeFromGrid = function () {
	$("stage").removeChild(this.div);
}