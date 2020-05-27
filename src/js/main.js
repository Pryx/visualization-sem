import { Circle, Path } from './primitives';
import { Node, Edge, Particle, Spring, Point, repoulsive_force, attractive_force } from './graph'
import * as $ from 'jquery'

(function(){
	const btn = document.getElementById('read');

	btn.addEventListener('click', (event) => {
		const file = document.getElementById('file-selector').files;
		console.log(file[0]);
		readFile(file[0]);
	});

	function readFile(file) {
		// Check if the file is an image.
		if (file.type && file.type.indexOf('json') === -1) {
			console.log('File is not an json.', file.type, file);
			return;
		}

		const reader = new FileReader();

		reader.addEventListener('progress', (event) => {
			if (event.loaded && event.total) {
				const percent = (event.loaded / event.total) * 100;
				console.log(`Progress: ${Math.round(percent)}`);
			}
		});

		var result;
		reader.addEventListener('load', (e) => {
			result = JSON.parse(e.target.result);
			console.log(result);
		});
		reader.readAsText(file);
		return result;
	}

	var canvas = document.getElementById('canvas'); 
	var ctx = canvas.getContext('2d'); 
	const canvasW = canvas.getBoundingClientRect().width;
	const canvasH = canvas.getBoundingClientRect().height;

	var scale = 2;
	canvas.width = canvasW * scale;
	canvas.height = canvasH * scale;
	var zoom = 1;
	var up = true;
	var i = 0;
	/*setInterval(function(){
		if (i == 4){
			up = false;
		}else if (i == 0){
			up = true
		}

		if (up){
			zoom = 1.25;
			i++
		}
		else{
			zoom = 0.8
			i--
		}

		console.log(i)

		ctx.scale(zoom, zoom);
		redraw(ctx);
	}, 1000);*/

	var stop = false;


	var vertices = [
		new Node(1, 2, "Cool", "person", canvas.width/2, canvas.height/2),
		new Node(2, 1, "Less cool", "person", canvas.width/2, canvas.height/2),
		new Node(3, 1, "Somewhat cool", "person", canvas.width/2, canvas.height/2),
		new Node(4, 0, "Outsider", "person", canvas.width/2, canvas.height/2),
	]

	var edges = [
		new Edge(1, vertices[1], vertices[0], "Text", "knows"),
		new Edge(2, vertices[2], vertices[0], "Edge 2", "knows"),
	]

	let eta = 0.99; // damping
	let delta_t = 0.1; //time


	async function redraw(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		edges.forEach(e => {
			let dist = e.from.p.distance_sqr(e.to.p);
			let rep = repoulsive_force(e.from, e.to);
			rep = rep.multiply(eta);
			rep = rep.multiply(delta_t);
			e.from.p = e.from.p.add(rep);

			let attr = attractive_force(e.from, e.to, dist);

			attr = rep.multiply(eta);
			attr = rep.multiply(delta_t);
			e.from.p = e.from.p.subtract(attr);

			//console.log(dist, rep, attr);

			let edge = new Path(
				ctx, 
				e.from.p.x+(e.from.degree*25/2), 
				e.from.p.y+(e.from.degree*25/2), 
				e.to.p.x+(e.to.degree*25/2), 
				e.to.p.y+(e.to.degree*25/2), 
				{
					fill: 'red', 
					stroke: {color: 'red', width:5}
				}
			);

			edge.draw();
		});

		vertices.forEach(v => {
			let vertex = new Circle(ctx, v.p.x, v.p.y, v.degree*25, {fill: 'blue', stroke: {color: 'blue', width:5}})
			vertex.draw();
		});
		await new Promise(r => setTimeout(r, 5));
		redraw()
	}

	redraw();
})();