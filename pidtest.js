
var pid = require('./pid');

var ctrl1 = new pid(0.1, 0.01, 0.1, -1, 1, 100);

// Simulate steady error state to test functional correctness of P and I factors
for(var i = 0; i < 10; i++) {
	console.log(ctrl1.process(90));
}

// Simulate a sweep to test functional correctness of P and D factors
for(var i = 0; i < 10; i++) {
	console.log(ctrl1.process(90+i));
}
