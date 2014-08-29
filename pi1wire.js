/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <baldur@foo.is> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return - Baldur Gislason
 * ----------------------------------------------------------------------------
 */

/* Module for reading 1-wire temperature sensors (DS18B20 et al) on Raspberry Pi */

var fs = require('fs');

function pi1wire() {
	var devs = fs.readdirSync('/sys/bus/w1/devices');
	this.thermos = [];
	for(i in devs) {
		if(devs[i].substr(0,3) == '28-') {
			this.thermos.push(devs[i]);
		}
	}
	this.thermos.sort();
}

pi1wire.prototype.list = function() {
	return this.thermos;
}

pi1wire.prototype.get = function(id, cb) {
	var filename;
	if(id instanceof String) {
		filename = '/sys/bus/w1/devices/' + id + '/w1_slave';
	} else {
		filename = '/sys/bus/w1/devices/' + this.thermos[id] + '/w1_slave';
	}
	fs.readFile(filename, function(err, data) {
		if(err) return cb(err, null);
		var d = data.toString();
		if(d.match(/YES/)) { 
			var m;
			if(m = d.match(/t=(.+)/)) {
				var t = parseInt(m[1]);
				t = t / 1000;
				return cb(null, t);
			}
		}
		return cb(null, null); // No value was read, please try again later
	});
}

pi1wire.prototype.getSync = function(id) {
	var filename;
	if(id instanceof String) {
		filename = '/sys/bus/w1/devices/' + id + '/w1_slave';
	} else {
		filename = '/sys/bus/w1/devices/' + this.thermos[id] + '/w1_slave';
	}
	var data = fs.readFileSync(filename);
	var d = data.toString();
	if(d.match(/YES/)) { 
		var m;
		if(m = d.match(/t=(.+)/)) {
			var t = parseInt(m[1]);
			t = t / 1000;
			return t;
		}
	}
	return null;
}

module.exports = pi1wire;
