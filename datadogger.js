var request = require('request');
var datadogApiKey = process.env.DATADOG_API_KEY;

if (!datadogApiKey) {
  console.log('ERR: You need to provide a DATADOG_API_KEY env variable to enable statistics collection.');
  process.exit(1);
}

var beerhost = process.argv[2] || '127.0.0.1:8000';
var sensorurl = 'http://' + beerhost + '/sensors';

setInterval(function () {

  console.log('Checking temperature...');
  request.get(sensorurl, function (err, res, body) {
    if (!err) {
      var parsed = JSON.parse(body);
      var temperature = parsed.temperature[0];
      console.log('Temperature is: ' + temperature);
      var data = {
        'series': [{
          'metric': 'beer.temperature',
    'points': [
    [parseInt(new Date().getTime() / 1000), temperature]
    ],
    'type': 'gauge',
    'host': 'oz.com',
    'tags': ['thermometer:0']
        }]
      };
      var options = {
        url: 'https://app.datadoghq.com/api/v1/series',
    qs: {
      api_key: datadogApiKey
    },
    json: data
      };
      request.post(options, function (err, res, body) {
        if (err) {
          console.error('GOT HIT BY AN ERROR!!!');
          console.error(err);
          return;
        }
        console.log('SUCCESS...');
      });
    }
});

}, 10000);
