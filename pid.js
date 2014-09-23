/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <baldur@foo.is> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return - Baldur Gislason
 * ----------------------------------------------------------------------------
 */

/* NodeJS PID controller library */

function pid(settings) {
  this.settings = settings;
	this.Istate = 0;
}

pid.prototype.process = function(inputvalue) {
	var currentvalue;
	if(inputvalue instanceof Function) {
		currentvalue = inputvalue();
	} else {
		currentvalue = inputvalue;
	}

	var setpoint;
	if(this.settings.setpoint instanceof Function) {
		setpoint = this.settings.setpoint();
	} else {
		setpoint = this.settings.setpoint;
	}

// console.log('Setpoint ' + setpoint + ' and current value ' + inputvalue);

	var P = this.settings.P;
	var I = this.settings.I;
	var D = this.settings.D;

	var error = setpoint - inputvalue;

	var Ppart = P * error;
	var Ipart = I * error;
	var Dpart;
	if(this.lastvalue == undefined) {
		Dpart = 0;
	} else {
		Dpart = D * (this.lastvalue - currentvalue);
	}
		this.lastvalue = inputvalue;

	this.Istate += Ipart;
	if(this.Istate > this.settings.Imax) this.Istate = this.settings.Imax;
	else if(this.Istate < this.settings.Imin) this.Istate = this.settings.Imin;

	var outputvalue = Ppart + this.Istate + Dpart;
	console.log('P ' + Ppart + ' I ' + this.Istate + ' D ' + Dpart + ' Output value ' + outputvalue);
	return outputvalue;
}

module.exports = pid;
