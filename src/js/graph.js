export function Node(id, degree, name, type,x,y, stat){
	this.id = id;
	this.name = name;
	this.type = type;
	this.m = this.degree = degree;
	this.p = new Point(x, y);
	this.v = new Point(0, 0); // velocity
	this.a = new Point(0, 0); // force
	this.static = stat || false;
}

export function Edge(id, from, to, text, type){
	this.id = id;
	this.from = from;
	this.to = to;
	this.text = text;
	this.type = type;
	this.k = 1
}

Node.prototype.applyForce = function(force){
		this.a = this.a.add(force.divide(this.m));
	}
/*
export function Spring(point1, point2, length, k)
{
	this.point1 = point1;
	this.point2 = point2;
	this.length = length; // spring length at rest
	this.k = k;           // stiffness
}

Spring.prototype.distanceToParticle = function(point)
{
	// see http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment/865080#865080
	var n = that.point2.p.subtract(that.point1.p).normalize().normal();
	var ac = point.p.subtract(that.point1.p);
	return Math.abs(ac.x * n.x + ac.y * n.y);
};
*/
export function Point(x, y){
	this.x = x;
	this.y = y;  
}

Point.prototype = {
	add:function(v2){
		return new Point(this.x + v2.x, this.y + v2.y);
	},
	subtract:function(v2){
		return new Point(this.x - v2.x, this.y - v2.y);
	},
	multiply:function(n){
		return new Point(this.x * n, this.y * n);
	},
	divide:function(n){
		return new Point(this.x / n, this.y / n);
	},
	magnitude:function(){
		return Math.max(1, Math.sqrt(this.x*this.x + this.y*this.y));
	},
	normal:function(){
		return new Point(-this.y, this.x);
	},
	normalize:function(){
		return this.divide(this.magnitude());
	},
	distance_sqr: function(point2){
		return new Point(Math.pow(this.x - point2.x,2), Math.pow(this.y - point2.y,2))
	}
}


