
var sensors;
var settings;

var sensorrequest = new XMLHttpRequest();
sensorrequest.onreadystatechange = function() {
  if(sensorrequest.readyState == 4 && sensorrequest.status == 200) {
    var sensors = JSON.parse(sensorrequest.responseText);
    document.getElementById('temp0').innerHTML = sensors.temperature[0].toFixed(1) + '°C';
    document.getElementById('temp1').innerHTML = sensors.temperature[1].toFixed(1) + '°C';
  }
}

var settingrequest = new XMLHttpRequest();
settingrequest.onreadystatechange = function() {
  if(settingrequest.readyState == 4 && settingrequest.status == 200) {
    settings = JSON.parse(settingrequest.responseText);
    displaysettings();
  }
}

var settingputrequest = new XMLHttpRequest();
settingputrequest.onreadystatechange = function() {
  if(settingputrequest.readyState == 4 && settingputrequest.status == 200) {
    getsettings();
  }
}

function updatesensors() {
  sensorrequest.open("GET", "/sensors", true);
  sensorrequest.send();
}

function getsettings() {
  settingrequest.open("GET", "/settings", true);
  settingrequest.send();
}

function putsettings() {
  
}

function displaysettings() {
  var mode = document.getElementsByName('controlmode');
  for(var i = 0; i < mode.length; i++) {
    if(settings.controlmode === mode[i].value) {
      mode[i].checked = true;
    }
  }
  document.getElementById('staticDC').value = settings.staticDC.toFixed(3) * 100;
}

updatesensors();
getsettings();
window.setInterval(updatesensors, 2000);


