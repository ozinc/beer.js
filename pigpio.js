/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <baldur@foo.is> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return - Baldur Gislason
 * ----------------------------------------------------------------------------
 */

var fs = require('fs');

function pigpio(id, direction) {
	this.id = id;
	this.filename = '/sys/class/gpio/gpio' + id.toString() + '/value';
	var fd = fs.openSync('/sys/class/gpio/export', 'w');
	var buf = new Buffer(id.toString());
	fs.writeSync(fd, buf, 0, buf.size, 0);
	fs.closeSync(fd);
	fd = fs.openSync('/sys/class/gpio/gpio' + id.toString() + '/direction', 'w');
	buf = new Buffer(direction);
	fs.writeSync(fd, buf, 0, buf.size, 0);
	fs.closeSync(fd);
}

pigpio.prototype.set = function(value, cb) {
	fs.writeFile(this.filename, value ? '1' : '0', cb);
}

pigpio.prototype.setSync = function(value) {
	return fs.writeFileSync(this.filename, value ? '1' : '0');
}

pigpio.prototype.get = function(cb) {
	fs.readFile(this.filename, function(err, data) {
		if(err) return cb(err, null);
		if(data == '1') {
			cb(null, true);
		} else {
			cb(null, false);
		}
	});
}

pigpio.prototype.getSync = function() {
	var val = fs.readFileSync(this.filename);
	if(val == '1') {
		return true;
	} else {
		return false;
	}
}

module.exports = pigpio;
