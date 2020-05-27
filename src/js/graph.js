export function Node(id, degree, name, type,x,y){
	this.id = id;
	this.name = name;
	this.type = type;
	this.degree = degree;
	this.p = new Point(x, y);
}

export function Edge(id, from, to, text, type){
	this.id = id;
	this.from = from;
	this.to = to;
	this.text = text;
	this.type = type;
}

export function Particle(position, mass){
	this.p = position;
	this.m = mass;
	this.v = new Point(0, 0); // velocity
	this.f = new Point(0, 0); // force
}

Particle.prototype.applyForce = function(force){
	this.f = this.f.add(force.divide(this.m));
}

export function Spring(point1, point2, length, k)
{
	this.point1 = point1;
	this.point2 = point2;
	this.length = length; // spring length at rest
	this.k = k;           // stiffness
}
/*
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
	exploded:function(){
		return ( isNaN(this.x) || isNaN(this.y) )
	},
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
		return Math.sqrt(this.x*this.x + this.y*this.y);
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

export function repoulsive_force(node1, node2){
	let point1 = node1.p; 
	let point2 = node2.p;

	let distance = point1.distance_sqr(point2)
	let distance_sqr = distance.x + distance.y
	if (distance_sqr != 0.0) {
		let ds = Math.sqrt(distance_sqr)
		let ds_pow_3 = distance_sqr * ds

		let cons = 0
		if (ds_pow_3 != 0.0)
			cons = node1.degree / (distance_sqr * ds)
		return new Point(-cons * Math.sqrt(distance.x), -cons * Math.sqrt(distance.y))
	} 

	return new Point((Math.random()-.5)*1000, (Math.random()-.5)*1000)
}

export function attractive_force(node1, node2, d_orig){
	let point1 = node1.p; 
	let point2 = node2.p;

	let distance = point1.distance_sqr(point2)
	let distance_orig = d_orig.x + d_orig.y
	let distance_sqr = distance.x + distance.y

	if (distance_sqr == 0){
		return new Point(0,0)
	}

	let dl = distance_sqr - distance_orig
	let cons = 10 * dl / distance_sqr
	return new Point(cons * Math.sqrt(distance.x), cons * Math.sqrt(distance.y))
}