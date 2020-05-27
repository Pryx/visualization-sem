import { Circle, Path } from './primitives';

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
	setInterval(function(){
		if (i == 4){
			up = false;
		}else if (i == 1){
			up = true
		}

		if (up){
			zoom = 1.25;
			i++
		}
		else{
			zoom = 0.75
			i--
		}

		console.log(i)

		ctx.scale(zoom, zoom);
		redraw(ctx);
	}, 1000);

	var stop = false;

	var vertices = [
		new Circle(ctx, 50,50,40, {fill: 'red', stroke: {color: 'red', width:5}}), 
		new Circle(ctx, 200,200,40, {fill: 'red', stroke: {color: 'red', width:5}}),
		new Circle(ctx, 500,200,40, {fill: 'blue', stroke: {color: 'blue', width:5}}),
		new Circle(ctx, 200,500,40, {fill: 'blue', stroke: {color: 'blue', width:5}})
	]

	var edges = [
		new Path(ctx, 70,70, 220,220, {fill: 'blue', stroke: {color: 'blue', width:5}}),
		new Path(ctx, 220,220, 520,220, {fill: 'green', stroke: {color: 'green', width:5}}),
		new Path(ctx, 520,220, 220,520, {fill: 'orange', stroke: {color: 'orange', width:5}})
	]

	async function redraw(ctx){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		edges.forEach(e => e.draw());

		vertices.forEach(e => e.draw());
		await new Promise(r => setTimeout(r, 2000));
	}

	redraw(ctx);
})();