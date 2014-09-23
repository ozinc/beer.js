var express = require('express');
var path = require('path');

var server = express();

var sensors = {
  temperature: []
};

sensors.temperature[0] = 25.333333;
sensors.temperature[1] = 0;

var settings = {
  controlmode: 'pid',
  pid: {
    setpoint: 67,
    P: 0.1,
    I: 0.01,
    D: 0.1,
    Imax: 1,
    Imin: -1
  },
  staticDC: 0.7,
  cycletime: 10
};

server.use(express.static(path.join(__dirname, 'static')));

function getsensors(req,res) {
  res.status(200).json(sensors);
}

function getsettings(req, res) {
  res.status(200).json(settings);
}

function rootredirect(req,res) {
  res.redirect('/beer.html');
}

server.get('/sensors', getsensors);
server.head('/sensors', getsensors);

server.get('/settings', getsettings);
server.head('/settings', getsettings);

server.all('/', rootredirect);

server.listen(8000);
