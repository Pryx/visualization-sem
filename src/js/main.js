import { Circle, Path } from './primitives';
import { Node, Edge, Point, repulsive_force, attractive_force } from './graph'
import * as $ from 'jquery'

(function(){

	var colors = [
		"#00FFFF",
		"#f0ffff",
		"#f5f5dc",
		"#000000",
		"#0000ff",
		"#a52a2a",
		"#00ffff",
		"#00008b",
		"#008b8b",
		"#a9a9a9",
		"#006400",
		"#bdb76b",
		"#8b008b",
		"#556b2f",
		"#ff8c00",
		"#9932cc",
		"#8b0000",
		"#e9967a",
		"#9400d3",
		"#ff00ff",
		"#ffd700",
		"#008000",
		"#4b0082",
		"#f0e68c",
		"#add8e6",
		"#e0ffff",
		"#90ee90",
		"#d3d3d3",
		"#ffb6c1",
		"#ffffe0",
		"#00ff00",
		"#ff00ff",
		"#800000",
		"#000080",
		"#808000",
		"#ffa500",
		"#ffc0cb",
		"#800080",
		"#800080",
		"#ff0000",
		"#c0c0c0",
		"#ffff00"
	];




	const btn = document.getElementById('read');

	var data
	var vertices = null
	var edges = null


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

			$("#nodes-count").text(result.vertices.length);
			$("#edges-count").text(result.edges.length);

			let i = 0;
			result.vertexArchetypes.forEach(t => {
				$("#node-types").append("<div><span class=\"circle-color\" style=\"background:" +
				colors[i] + "\"></span> " + t.name + "</div>");
				i++;
			});


			compute_coordinates(result);
		});
		reader.readAsText(file);
		
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
	var i = 1;

	let eta = 0.9; // damping
	let delta_t = 0.1; //time
	let max_v = 50; //time
	let repulsion = 1500;


	let offset_w = canvasW * scale / 2;
	let offset_h = canvasH * scale / 2;
	let middle = new Point(offset_w, offset_h);


	function compute_coordinates(data){
		vertices = []
		for(let i=0; i < data.vertices.length; i++){
			vertices[data.vertices[i].id] =
				new Node(
					i,
					1,
					data.vertices[i].title,
					data.vertices[i].archetype,
					offset_w*Math.random(),
					offset_h*Math.random()
				)
			
		}

		edges = []
		for(let i=0; i < data.edges.length; i++){
			let info = ""
			if(data.edges[i].attributes) info = data.edges[i].attributes[32]
			edges.push(
				new Edge(
					i,
					vertices[data.edges[i].from],
					vertices[data.edges[i].to],
					data.edges[i].text,
					info
				)
			)
			vertices[data.edges[i].from].degree++;
			vertices[data.edges[i].to].degree++;
		}

		redraw();
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

		
		
		redraw();

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




	let edge_labels = false;
	let node_labels = false;

	$("#edge_labels").click((e) => { edge_labels = e.target.checked})
	$("#node_labels").click((e) => { node_labels = e.target.checked})


	var stop = false;

	async function redraw(){

		if (vertices == null || edges == null){
			return
		}

		ctx.save();
		ctx.setTransform(1,0,0,1,0,0);
		// Will always clear the right space
		ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
		ctx.restore();

		//Vertex repulsion
		vertices.forEach(v => {
			vertices.forEach(v2 => {
				if (v.id !== v2.id)
				{
					var d = v.p.subtract(v2.p);
					var distance = d.magnitude();//Divide by zero fix
					var direction = d.normalize();
					let degreeMax = Math.max(v.degree, v2.degree)
					if (distance < Math.log2(degreeMax)*300){
						v.applyForce(
						direction.multiply(repulsion).divide(distance * distance*0.01)
						);
						v2.applyForce(
							direction.multiply(repulsion ).divide(distance * distance*-0.01)
						);
					}else{
						v.applyForce(
							direction.multiply(repulsion)
								.divide(distance * distance * 0.5)
						);
						v2.applyForce(
							direction.multiply(repulsion )
								.divide(distance * distance * -0.5)
						);
					}
				}
			});
		});

		//Edge pullback
		edges.forEach(spring => {
			var d = spring.to.p.subtract(spring.from.p); // the direction of the spring
			var displacement = repulsion; //+ 100*Math.max(spring.to.degree, spring.from.degree);
			displacement -=  d.magnitude(); 
			var direction = d.normalize();

			// apply force to each end point
			spring.from.applyForce(direction.multiply(spring.k * displacement * -0.5));
			spring.to.applyForce(direction.multiply(spring.k * displacement * 0.5));
		});


		//Go to center
		vertices.forEach(v => {
			var direction = middle.subtract(v.p);

			//console.log(v.p)

			v.applyForce(direction.multiply(Math.sqrt(repulsion) / 50.0));
		});

		vertices.forEach(v =>  {
			v.v = v.v.add(v.a.multiply(delta_t)).multiply(eta);
			if (v.v.magnitude() > max_v) {
				//console.log("MAX VELOCITY!")
				v.v = v.v.normalize().multiply(max_v);
			}
			//console.log("VA? VV?",v.a, v.v)

			//console.log("VPB?",v.p)
			v.p = v.p.add(v.v);

			//console.log("VPA?",v.p)

			v.a = new Point(0,0);
		});

		edges.forEach(e => {
			//console.log(dist, rep, attr);
			let pos_f = e.from.p;
			let pos_t = e.to.p;
			let edge = new Path(
				ctx, 
				pos_f.x+(Math.log2(e.from.degree+1)*25/2), 
				pos_f.y+(Math.log2(e.from.degree+1)*25/2), 
				pos_t.x+(Math.log2(e.to.degree+1)*25/2), 
				pos_t.y+(Math.log2(e.to.degree+1)*25/2), 
				{
					fill: 'red', 
					stroke: {color: 'red', width:5}
				},
				edge_labels?"Edge label":undefined
			);

			edge.draw();
		});

		vertices.forEach(v => {
			let pos = v.p;
			let vertex = new Circle(
				ctx,
				pos.x,
				pos.y,
				Math.log2(v.degree+1)*25,
				{
					fill: colors[v.type], 
					stroke: {color: colors[v.type], width:5}
				},
				node_labels?"Node label":undefined
			);
			vertex.draw();
		});

		await new Promise(r => setTimeout(r, 50));
		redraw()
	}
})();