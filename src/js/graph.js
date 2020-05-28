export function Node(id, degree, name, type,x,y, description){
	this.id = id;
	this.name = name;
	this.type = type;
	this.m = this.degree = degree;
	this.p = new Point(x, y);
	this.v = new Point(0, 0); // velocity
	this.a = new Point(0, 0); // force
	this.description = description || "No description"
	this.show = false;
	this.expandable = true;
}

export function Edge(id, from, to, text, type){
	this.id = id;
	this.from = from;
	this.to = to;
	this.text = text;
	this.type = type;
	this.k = (
		to.degree==from.degree?0.0001 : (Math.pow(to.degree/from.degree,2)>0? 
		(Math.pow(to.degree/from.degree,2)>.5?.5:Math.pow(to.degree/from.degree,2))
		: 0.0001))
}

Node.prototype.applyForce = function(force){
		this.a = this.a.add(force.divide(this.m));
	}


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
	},
	rotate: function(rad)
	{
		return new Point(
			this.x * Math.cos(rad) - this.y * Math.sin(rad),
			this.x * Math.sin(rad) + this.y * Math.cos(rad)
		);
	}
}


