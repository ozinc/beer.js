var pigpio = require('./pigpio');
var pi1wire = require('./pi1wire');
var pid = require('./pid');

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

var server = express();

var settingsfile = 'settings.json';
var dummymode = false;

try {
  var gpio2 = new pigpio(2, 'out');
  var gpio3 = new pigpio(3, 'out');
  var thermo = new pi1wire();
} catch(er) {
  console.log('Not all hardware is in place, running in dev mode');
  dummymode = true;
}

var sensors = {
  temperature: [0, 0],
  dutycycle: 0
};

var settings = {
  controlmode: 'pid',
  pid: {
    setpoint: 67,
    P: 0.1,
    I: 0.01,
    D: 0.1,
    Imax: 1,
    Imin: -1,
    offset: 0.2
  },
  staticDC: 0.7,
  cycletime: 10
};

try {
  var nonvolatile = fs.readFileSync(settingsfile);
  settings = JSON.parse(nonvolatile.toString());
  console.log(settings);
} catch(er) {
  console.log('No stored settings found, using default');
}

var pidctl = new pid();

server.use(bodyParser.json());
server.use(express.static(path.join(__dirname, 'static')));

// Read temperature every 2 seconds or so
setInterval(function() {
  if(dummymode) {
    sensors.temperature[0] += 0.1;
    return;
  }
  thermo.get(0, function (err, val) {
    sensors.temperature[0] = val;
    console.log('Temperature is ' + val);
  });
  thermo.get(1, function(err,val) {
    sensors.temperature[1] = val;
  });
}, 2000);

function setoutputs(val) {
  if(dummymode) return;
  gpio2.set(val, null);
  gpio3.set(val, null);
}

function outputprocess() {
  var output;
  if(settings.controlmode === 'pid') {
    output = pidctl.process(settings.pid, sensors.temperature[0]);
    output += settings.pid.offset;
  } else if(settings.controlmode === 'manual') {
    output = settings.staticDC;
  } else {
    output = 0;
  }
  sensors.dutycycle = output;
  var delay = settings.cycletime * 1000 * output;
  if(output <= 0) {
    console.log('0% duty');
    setoutputs(0);
  } else if(output >= 1) {
    console.log('100% duty');
    setoutputs(1);
  } else {
    console.log(output * 100 + '% duty');
    setoutputs(1);
    setTimeout(function() {
      setoutputs(0);
      console.log('Turning off on timer');
    }, delay);
  }
}

var outpchandle = setInterval(outputprocess, settings.cycletime * 1000);

function getsensors(req,res) {
  var date = new Date();
  sensors.servertime = date.toISOString();
  res.status(200).json(sensors);
}

function getsettings(req, res) {
  res.status(200).json(settings);
}

function setsettings(req, res) {
  console.log(req.body);
  var ct = settings.cycletime;
  settings = req.body;
  if(ct != settings.cycletime) {
    clearInterval(outpchandle);
    outpchandle = setInterval(outputprocess, settings.cycletime * 1000);
  }
  fs.writeFile(settingsfile, JSON.stringify(settings), function(err) {
    if(err) console.log('Error saving settings to file');
  });
  res.status(200).json({ result: 'success' });
} 

function rootredirect(req,res) {
  res.redirect('/beer.html');
}

server.get('/sensors', getsensors);
server.head('/sensors', getsensors);

server.get('/settings', getsettings);
server.head('/settings', getsettings);
server.post('/settings', setsettings);

server.all('/', rootredirect);

server.listen(8000);

function _exit(err) {
  if(!dummymode) {
    gpio2.setSync(0);
    gpio3.setSync(0);
  }
  if(err) console.log(err.stack);
  process.exit();
}

if(!dummymode) {
  process.on('exit', _exit.bind());
  process.on('SIGINT', _exit.bind());
  process.on('uncaughtException', _exit.bind());
}

