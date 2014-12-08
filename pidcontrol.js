var debug = require('debug')('pidcontrol')

var request = require('request');

var pigpio = require('./pigpio');
var pi1wire = require('./pi1wire');
var pid = require('./pid');

var gpio2 = new pigpio(2, 'out');

var thermo = new pi1wire();

var pidctl = new pid(0.1, 0.01, 0.1, -1, 1, 30);

var cycletime = 10; // Run PWM cycle for 10 seconds

var datadogApiKey = process.env.DATADOG_API_KEY;

if (!datadogApiKey) {
	console.log('ERR: You need to provide a DATADOG_API_KEY env variable.');
	process.exit(-1);
}

// Read temperature every 2 seconds or so
setInterval(function() {
	thermo.get(0, function (err, val) {
		temperature = val;
		//console.log('Temperature is ' + val);
		var data = {
			"series": [{
					"metric": "beer.temperature",
					"points": [[new Date().getTime(), 0]],
					"type": "counter",
					"host": "oz.com",
					"tags": ["thermometer:0"]
				}]
		};
		var options = {
			'url': 'https://app.datadoghq.com/api/v1/series?api_key=' + datadogApiKey,
			'body': data,
			'headers': {
				'Content-Type': 'application/json'
			}
		};
		request.post(options, function (err, res, body) {
			if (err) {
				console.error(err);
				return;
			}
		});
	});
}, 2000);

setInterval(function() {
	var output = pidctl.process(temperature);
	var delay = cycletime * 1000 * output;
	if(output <= 0) {
		debug('0% duty');
		gpio2.set(0, null);
	} else if(output >= 1) {
		debug('100% duty');
		gpio2.set(1, null);
	} else {
		debug(output * 100 + '% duty');
		gpio2.set(1, function() {
			setTimeout(function() {
				gpio2.set(0, null);
				debug('Turning off on timer');
			}, delay);
		});
	}
}, cycletime * 1000);

function _exit() {
	gpio2.setSync(0);
	process.exit();
}

process.on('exit', _exit.bind());
process.on('SIGINT', _exit.bind());
process.on('uncaughtException', _exit.bind());
