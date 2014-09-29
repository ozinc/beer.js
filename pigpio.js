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
	this.watcher = '';
	if(fs.existsSync(this.filename)) {
		fs.writeFileSync('/sys/class/gpio/unexport', id.toString());
	}
	fs.writeFileSync('/sys/class/gpio/export', id.toString());
	fs.writeFileSync('/sys/class/gpio/gpio' + id.toString() + '/direction', direction);
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
		if(data.toString().substr(0, 1) == '1') {
			cb(null, true);
		} else {
			cb(null, false);
		}
	});
}

pigpio.prototype.getSync = function() {
	var data = fs.readFileSync(this.filename);
	if(data.toString().substr(0, 1) == '1') {
		return true;
	} else {
		return false;
	}
}

pigpio.prototype.watch = function(cb) {
	var port = this;
	this.watcher = setInterval(function() {
		port.get(function(err, val) {
			if(port.laststate != undefined) {
				if(port.laststate != val) {
					port.laststate = val;
					return cb(val);
				}
			}
			port.laststate = val;
		});	
	}, 20);
}

pigpio.prototype.unwatch = function() {
	clearInterval(this.watcher);
}

module.exports = pigpio;
