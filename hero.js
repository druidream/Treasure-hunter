/**
 * 
 */
function Hero (x, y) {
	this.x = x;
	this.y = y;
	
	var div = document.createElement("div");
	div.id = "hero";
	div.className = "cell hero";
	//div.innerHTML = "H";
	$("stage").appendChild(div);
	
	this.div = div;

	this.render(x, y);
}

Hero.prototype.movesTo = function(x, y) {
	this.x = x;
	this.y = y;
	
	this.render(this.x, this.y);
}

Hero.prototype.render = function(x, y) {
	this.div.style.left = (36 * x + 1) + "px";
	this.div.style.top = (36 * y + 1) + "px";
}

Hero.prototype.removeFromGrid = function () {
	$("stage").removeChild(this.div);
}