/**
 * 
 */
function Treasure(x, y, value) {
	this.x = x;
	this.y = y;
	this.value = value;

	var div = document.createElement("div");
	div.id = "treasure-" + x + "-" + y;
	div.className = "cell treasure";
	div.innerHTML = value;
	$("stage").appendChild(div);
	
	this.div = div;
	
	this.render(x, y);
}

Treasure.prototype.render = function(x, y) {
	this.div.style.left = (36 * x + 1) + "px";
	this.div.style.top = (36 * y + 1) + "px";
}

Treasure.prototype.removeFromGrid = function () {
	console.log("remove treasure(" +  + this.x + "," + this.y + ") value:" + this.value);
	$("stage").removeChild(this.div);
}