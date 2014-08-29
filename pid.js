/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <baldur@foo.is> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return - Baldur Gislason
 * ----------------------------------------------------------------------------
 */

/* NodeJS PID controller library */

function pid(P, I, D, Imin, Imax, setpoint) {
	this.Pgain = P;
	this.Igain = I;
	this.Dgain = D;
	this.Imax = Imax;
	this.Imin = Imin;
	this.Istate = 0;
	this.setpoint = setpoint;
}

pid.prototype.process = function(inputvalue) {
	var currentvalue;
	if(inputvalue instanceof Function) {
		currentvalue = inputvalue();
	} else {
		currentvalue = inputvalue;
	}

	var setpoint;
	if(this.setpoint instanceof Function) {
		setpoint = this.setpoint();
	} else {
		setpoint = this.setpoint;
	}

	//console.log('Setpoint ' + setpoint + ' and current value ' + inputvalue);

	var P = this.Pgain;
	var I = this.Igain;
	var D = this.Dgain;

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
	if(this.Istate > this.Imax) this.Istate = this.Imax;
	else if(this.Istate < this.Imin) this.Istate = this.Imin;

	var outputvalue = Ppart + this.Istate + Dpart;
	console.log('P ' + Ppart + ' I ' + this.Istate + ' D ' + Dpart + ' Output value ' + outputvalue);
	return outputvalue;
}

module.exports = pid;
