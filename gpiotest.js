var pigpio = require('./pigpio');

var gpio2 = new pigpio(2, 'out');

gpio2.set(true, function(err) {
	setTimeout(function(){
		gpio2.set(false, function(err) {
			});
	}, 2000);
});
