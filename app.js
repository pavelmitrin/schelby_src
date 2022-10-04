// Введение файловый модуль
import fs from 'fs';


fs.readFile('./node_modules/gulp-fonter/dist/index.js', function (err, data) {
	if (err) {
		return console.log(err);
	}
	let result = data.toString().replace(/\\\\/g, '/');

	fs.writeFile('./node_modules/gulp-fonter/dist/index.js', result, 'utf8', function (err) {
		if (err) return console.log(err);
	});
	console.log('Done!!!');
});