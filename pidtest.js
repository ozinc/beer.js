
var pid = require('./pid');

var ctrl1 = new pid(0.1, 0.01, 0.1, -1, 1, 100);

for(var i = 0; i < 10; i++) {
	console.log(ctrl1.process(90));
}

for(var i = 0; i < 10; i++) {
	console.log(ctrl1.process(90+i));
}
