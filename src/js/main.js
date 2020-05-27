//import { PositionService } from './position-service';
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
})();