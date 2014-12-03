/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <baldur@foo.is> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return - Baldur Gislason
 * ----------------------------------------------------------------------------
 */

/* NodeJS PID controller library */

function pid() {
	this.Istate = 0;
}
function round(n) {return Math.round(n*100)/100;}

pid.prototype.process = function(settings, inputvalue) {
	var currentvalue;
	if(inputvalue instanceof Function) {
		currentvalue = inputvalue();
	} else {
		currentvalue = inputvalue;
	}

	var setpoint;
	if(settings.setpoint instanceof Function) {
		setpoint = settings.setpoint();
	} else {
		setpoint = settings.setpoint;
	}

// console.log('Setpoint ' + setpoint + ' and current value ' + inputvalue);

	var P = settings.P;
	var I = settings.I;
	var D = settings.D;

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
	if(this.Istate > settings.Imax) this.Istate = settings.Imax;
	else if(this.Istate < settings.Imin) this.Istate = settings.Imin;

	var outputvalue = Ppart + this.Istate + Dpart;
	console.log('P ' + round(Ppart) + ' I ' + round(this.Istate) + ' D ' + round(Dpart) + ' Output value ' + round(outputvalue));
	return outputvalue;
}

module.exports = pid;
