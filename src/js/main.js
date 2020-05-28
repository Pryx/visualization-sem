import { Circle, Path } from './primitives';
import { Node, Edge, Point, repulsive_force, attractive_force } from './graph'
import * as $ from 'jquery'

(function(){

	var colors = [
		"#007bff",
		"#6610f2",
		"#e83e8c",
		"#dc3545",
		"#fd7e14",
		"#ffc107",
		"#28a745",
		"#20c997",
		"#17a2b8",
		"#fff",
		"#6c757d",
		"#343a40",
		"#007bff",
		"#6c757d",
		"#28a745",
		"#17a2b8",
		"#ffc107",
		"#dc3545",
		"#f8f9fa",
		"#343a40",
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
	//var zoom = 1;
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

			let atype = ""
			if(data.edges[i].archetype) atype = data.edges[i].archetype
			if(data.edges[i].subedgeInfo) atype = data.edges[i].subedgeInfo[0].archetype

			edges.push(
				new Edge(
					i,
					vertices[data.edges[i].from],
					vertices[data.edges[i].to],
					data.edges[i].text,
					atype
				)
			)
			vertices[data.edges[i].from].degree++;
			vertices[data.edges[i].to].degree++;
		}

		if (!running)
			redraw()
	}


	var zoom = {
		scale : 1,
		screen : {
			x : 0,
			y : 0,
		},
		world : {
			x : 0,
			y : 0,
		},
	};

	var mouse = {
		screen : {
			x : 0,
			y : 0,
		},
		world : {
			x : 0,
			y : 0,
		},
	};

	var shift = {
		x: 0,
		y: 0
	}

	var zoom_scale = {
		length : function(number) {
			return Math.floor(number * zoom.scale);
		},
		x : function(number) {
			return Math.floor((number - zoom.world.x) * zoom.scale + zoom.screen.x);
		},
		y : function(number) {
			return Math.floor((number - zoom.world.y) * zoom.scale + zoom.screen.y);
		},
		x_INV : function(number) {
			return Math.floor((number - zoom.screen.x) * (1 / zoom.scale) + zoom.world.x);
		},
		y_INV : function(number) {
			return Math.floor((number - zoom.screen.y) * (1 / zoom.scale) + zoom.world.y);
		},
	};


	canvas.addEventListener("wheel", zoomUsingCustomScale);

	function zoomUsingCustomScale(e) {
		trackMouse(e);
		trackWheel(e);
		scaleShapes();
		console.log("SCALING")
	}

	function trackMouse(e) {
		mouse.screen.x	= e.clientX*scale - shift.x;
		mouse.screen.y	= e.clientY*scale - shift.y;
		mouse.world.x	= zoom_scale.x_INV(mouse.screen.x);
		mouse.world.y	= zoom_scale.y_INV(mouse.screen.y);
	}

	function trackWheel(e) {
		if (e.deltaY < 0) {
			zoom.scale = Math.min(5, zoom.scale * 1.1);
		} else {
			zoom.scale = Math.max(0.1, zoom.scale * (1/1.1));
		}
	}

	function scaleShapes() {
		zoom.screen.x	= mouse.screen.x;
		zoom.screen.y	= mouse.screen.y;
		zoom.world.x	= mouse.world.x;
		zoom.world.y	= mouse.world.y;
		mouse.world.x	= zoom_scale.x_INV(mouse.screen.x);
		mouse.world.y	= zoom_scale.y_INV(mouse.screen.y);
	}
	
	function change_zoom(up){
		$("#zoom-up").attr("disabled", true);
		$("#zoom-down").attr("disabled", true);

		if (up && zoom.scale<5){
			zoom.scale *= 1.1;
		}
		else if (zoom.scale>0.1){
			zoom.scale *= 1/1.1
		}



		if (zoom.scale == 5){
			$("#zoom-up").attr("disabled", true);
			$("#zoom-down").attr("disabled", false);
		}else if (zoom.scale == 0.1){
			$("#zoom-up").attr("disabled", false);
			$("#zoom-down").attr("disabled", true);
		} else {
			$("#zoom-up").attr("disabled", false);
			$("#zoom-down").attr("disabled", false);
		}

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
		if (e.button === 0) {
			vertices.forEach((v) =>{
				let r = zoom_scale.length(Math.log2(v.degree+1)*25/2);
				let dx = v.p.x+r - zoom_scale.x(e.pageX*scale),
					dy = v.p.y+r - zoom_scale.y(e.pageY*scale),
					dist = Math.abs(dx + dy);

				if (dist <= r) { 
					console.log("Clicked vertex "+v.id)
				}
			});
		}else{
			//move
			down = true;
			defX = e.pageX
			defY = e.pageY	
		}
	});


	$("#canvas").mousemove(function(event){
		if(down){
			shift.x += scale*(event.pageX - defX);
			shift.y += scale*(event.pageY - defY)
			ctx.translate(scale*(event.pageX - defX), scale*(event.pageY - defY))
			defX = event.pageX
			defY = event.pageY
		}
	});




	let edge_labels = false;
	let node_labels = false;

	$("#edge_labels").click((e) => { edge_labels = e.target.checked})
	$("#node_labels").click((e) => { node_labels = e.target.checked})


	var running = false;

	async function redraw(){

		if (vertices == null || edges == null){
			running = false;
			return
		}

		running = true;

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
				new Point(
					zoom_scale.x(pos_f.x)+zoom_scale.length(Math.log2(e.from.degree+1)*25/2), 
					zoom_scale.y(pos_f.y)+zoom_scale.length(Math.log2(e.from.degree+1)*25/2)
				),
				new Point(
					zoom_scale.x(pos_t.x)+zoom_scale.length(Math.log2(e.to.degree+1)*25/2), 
					zoom_scale.y(pos_t.y)+zoom_scale.length(Math.log2(e.to.degree+1)*25/2)
				), 
				zoom_scale.length(Math.log2(e.to.degree+1)*25/2+10),
				{
					fill: colors[colors.length - e.type - 1], 
					stroke: {
						color: colors[colors.length - e.type - 1], 
						width:3
					},
					font: {
						family: "Roboto",
						size: zoom_scale.length(14)
					},
					triangle: {
						size: zoom_scale.length(30),
						degree: Math.PI/12
					}
				},

				edge_labels?e.text:undefined
			);

			edge.draw();
		});

		vertices.forEach(v => {
			let pos = v.p;
			let vertex = new Circle(
				ctx,
				new Point(
					zoom_scale.x(pos.x),
					zoom_scale.y(pos.y),
				), 
				zoom_scale.length(Math.log2(v.degree+1)*25),
				{
					fill: colors[v.type], 
					stroke: {
						color: colors[v.type], 
						width:5
					},
					font: {
						family: "Roboto",
						size: zoom_scale.length(14)
					}
				},
				node_labels?v.name:undefined
			);
			vertex.draw();
		});

		await new Promise(r => setTimeout(r, 5));
		redraw()
	}
})();