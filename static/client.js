
var sensors;
var settings;

var sensorrequest = new XMLHttpRequest();
sensorrequest.onreadystatechange = function() {
  if(sensorrequest.readyState == 4 && sensorrequest.status == 200) {
    var sensors = JSON.parse(sensorrequest.responseText);
    document.getElementById('temp0').innerHTML = sensors.temperature[0].toFixed(1) + '°C';
    document.getElementById('temp1').innerHTML = sensors.temperature[1].toFixed(1) + '°C';
    document.getElementById('dc').innerHTML = sensors.dutycycle.toFixed(3) * 100 + '%';
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
    alert("OK");
    document.getElementById('setstatus').innerHTML = 'Updated settings';
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

function formtosettings() {
  var mode = document.getElementsByName('controlmode');
  for(var i = 0; i < mode.length; i++) {
    if(mode[i].checked === true) {
      settings.controlmode = mode[i].value;
    }
  }
  settings.staticDC = parseFloat(document.getElementById('staticDC').value) / 100;
  settings.cycletime = parseInt(document.getElementById('cycletime').value);
  settings.pid.setpoint = parseFloat(document.getElementById('setpoint').value);
  settings.pid.P = parseFloat(document.getElementById('Pfactor').value);
  settings.pid.I = parseFloat(document.getElementById('Ifactor').value);
  settings.pid.D = parseFloat(document.getElementById('Dfactor').value);
  settings.pid.Imax = parseFloat(document.getElementById('Imax').value);
  settings.pid.Imin = parseFloat(document.getElementById('Imin').value);
}

function putsettings() {
  formtosettings();
  settingputrequest.open("POST", "/settings", true);
  settingputrequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  settingputrequest.send(JSON.stringify(settings));
}

function displaysettings() {
  var mode = document.getElementsByName('controlmode');
  for(var i = 0; i < mode.length; i++) {
    if(settings.controlmode === mode[i].value) {
      mode[i].checked = true;
    }
  }
  document.getElementById('staticDC').value = settings.staticDC.toFixed(3) * 100;
  document.getElementById('cycletime').value = settings.cycletime;
  document.getElementById('setpoint').value = settings.pid.setpoint.toFixed(1);
  document.getElementById('Pfactor').value = settings.pid.P;
  document.getElementById('Ifactor').value = settings.pid.I;
  document.getElementById('Dfactor').value = settings.pid.D;
  document.getElementById('Imax').value = settings.pid.Imax;
  document.getElementById('Imin').value = settings.pid.Imin;
}

updatesensors();
getsettings();
window.setInterval(updatesensors, 2000);

document.getElementById('updatesettings').onclick = putsettings;

