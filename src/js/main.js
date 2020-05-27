import { Circle, Path } from './primitives';
import { Node, Edge, Particle, Spring, Point, repoulsive_force, attractive_force } from './graph'
import * as $ from 'jquery'

(function(){
	const btn = document.getElementById('read');

	var data
	var vertices = null
	var edges = null
	let eta = 0.99; // damping
	let delta_t = 0.1; //time

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
			compute_coordinates(result);
		});
		reader.readAsText(file);
		
	}


	function compute_coordinates(data){
		vertices = []
		for(let i=0; i < data.vertices.length; i++){
			vertices.push(
				new Node(
					i,
					2,
					data.vertices[i].title,
					data.vertices[i].archetype,
					canvas.width/2 + i*63,
					canvas.height/2 + i*20*Math.random(28)
				)
			)
		}

		edges = []
		for(let i=0; i < data.edges.length; i++){
			edges.push(
				new Edge(
					i,
					data.edges[i].from,
					data.edges[i].to,
					data.edges[i].text,
					data.edges[i].attributes[32]
				)
			)
		}


	}

	
	function change_zoom(up){

		if (i == 10){
			$("#zoom-up").attr("disabled", true);
		}else if (i == 0){
			$("#zoom-down").attr("disabled", true);
		} else {
			$("#zoom-up").attr("disabled", false);
			$("#zoom-down").attr("disabled", false);
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




	}



	$("body").on("click","#zoom-up",  function(){
		change_zoom(true);
		

	});

	$("body").on("click","#zoom-down",  function(){
		change_zoom(false);
		
	});

	var defY;
	var defX;

	var down = false;
	$(document).mouseup(function() {
		down = false;  
	});

	$("body").on("mousedown","#canvas",  function(e){
		//move
		
		down = true;
		defX = e.pageX
		defY = e.pageY



		
	});


		$("#canvas").mousemove(function(event){
			if(down){
				let k = 1
				if(i != 1) k = Math.pow(.8,i-1)
				ctx.translate(k*scale*(event.pageX - defX), k*scale*(event.pageY - defY))
				defX = event.pageX
				defY = event.pageY
			}
		});




	var canvas = document.getElementById('canvas'); 
	var ctx = canvas.getContext('2d'); 
	const canvasW = canvas.getBoundingClientRect().width;
	const canvasH = canvas.getBoundingClientRect().height;

	var scale = 2;
	canvas.width = canvasW * scale;
	canvas.height = canvasH * scale;
	var zoom = 1;
	var up = true;
	var i = 1;



	var stop = false;





	async function redraw(){
		ctx.clearRect(0, 0, 100*scale*canvas.width, 100*scale*canvas.height);
		if(edges != null){

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
	}

	redraw();
})();