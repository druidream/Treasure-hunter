/**
 * 
 */
function Killer(x, y) {
	this.x = x;
	this.y = y;
	
	var div = document.createElement("div");
	div.id = "killer-" + x + "-" + y;
	div.className = "cell killer";
	//div.innerHTML = "K";
	$("stage").appendChild(div);
	
	this.div = div;
	
	this.render(x, y);
}

Killer.prototype.movesTo = function(x, y) {
	this.x = x;
	this.y = y;
	
	this.render(this.x, this.y);
}

Killer.prototype.render = function(x, y) {
	this.div.style.left = (36 * x + 1) + "px";
	this.div.style.top = (36 * y + 1) + "px";
}

Killer.prototype.removeFromGrid = function () {
	$("stage").removeChild(this.div);
}