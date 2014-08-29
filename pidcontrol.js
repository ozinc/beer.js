var pigpio = require('./pigpio');
var pi1wire = require('./pi1wire');
var pid = require('./pid');

var gpio2 = new pigpio(2, 'out');

var thermo = new pi1wire();

var pidctl = new pid(0.1, 0.01, 0.1, -1, 1, 30);

var cycletime = 10; // Run PWM cycle for 10 seconds

// Read temperature every 2 seconds or so
setInterval(function() {
	thermo.get(0, function(err, val) {
		temperature = val;
		console.log('Temperature is ' + val);
		});
	}, 2000);

setInterval(function() {
	var output = pidctl.process(temperature);
	var delay = cycletime * 1000 * output;
	if(output <= 0) {
		console.log('0% duty');
		gpio2.set(0, null);
	} else if(output >= 1) {
		console.log('100% duty');
		gpio2.set(1, null);
	} else {
		console.log(output * 100 + '% duty');
		gpio2.set(1, function() {
			setTimeout(function() {
				gpio2.set(0, null);
				console.log('Turning off on timer');
			}, delay);
		});
	}
}, cycletime * 1000);
	       	       
