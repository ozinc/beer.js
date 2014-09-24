
var pid = require('./pid');

var settings = {
  P: 0.1,
  I: 0.01,
  D: 0.1,
  Imax: 1,
  Imin: -1,
  setpoint:100
};

var ctrl1 = new pid();

// Simulate steady error state to test functional correctness of P and I factors
for(var i = 0; i < 10; i++) {
	console.log(ctrl1.process(settings, 90));
}

// Simulate a sweep to test functional correctness of P and D factors
for(var i = 0; i < 10; i++) {
	console.log(ctrl1.process(settings, 90+i));
}
