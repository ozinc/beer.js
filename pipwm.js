var cp = require('child-process');

pipwm = function(pin, period) {
  this.period = period;
  this.helper = cp.spawn('helpers/pwm', [ pin, period, 0 ]);
  this.helper.on('close', function(code) {
      console.log('PWM process exited with code %d', code);
  });
}

pipwm.prototype.update(value) {
  this.helper.stdin.write(value * this.period);
}

pipwm.prototype.destroy() {
  this.helper.stdin.end();
}

module.exports = pipwm;
