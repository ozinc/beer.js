
var pi1wire = require('./pi1wire');

var thermo = new pi1wire();

var sensors = thermo.list();
console.log('Found sensors: ' + sensors);

for(i in sensors) {
	var temperature = thermo.getSync(i);
	console.log(sensors[i] + ' has temperature ' + temperature);
}

for(i in sensors) {
	thermo.get(i, function(err, val) {
		console.log('Got async response ' + val);
	});
}
