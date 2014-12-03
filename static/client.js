var sensors;
var sensordata = [];
var settings;

function updatesensors() {
  $.getJSON('/sensors', function(data){
    sensors = data;
    $('#temp0').text(sensors.temperature[0].toFixed(1) + '°C');
    try {
      $('#temp1').text(sensors.temperature[1].toFixed(1) + '°C');
    } catch (e) { console.log('Looks like we only have one sensor...'); }

    $('#dc').text((sensors.dutycycle * 100).toFixed(1) + '%');
    $('#date').text(sensors.servertime);

    // Temperature graph
    sensordata.push(sensors.temperature[0]);
    // Trim history to max 5 minutes. Todo: Log everything to sqlite via node?
    if (sensordata.length > 150) sensordata.splice(0,1);
    $('#tempchart').sparkline(sensordata, {width: 350, height: 60, tooltipSuffix: ' degrees celsius'});
  });
}

function getsettings() {
  $.getJSON('/settings', function(data) {
    settings = data;
    console.log(data);
    displaysettings();
  });
}

function formtosettings() {

  settings.controlmode = $('input[name=controlmode]:checked').val();
  settings.staticDC = parseFloat($('#staticDC').val()) / 100;
  settings.cycletime = parseInt($('#cycletime').val());
  settings.pid.setpoint = parseFloat($('#setpoint').val());
  settings.pid.P = parseFloat($('#Pfactor').val());
  settings.pid.I = parseFloat($('#Ifactor').val());
  settings.pid.D = parseFloat($('#Dfactor').val());
  settings.pid.Imax = parseFloat($('#Imax').val());
  settings.pid.Imin = parseFloat($('#Imin').val());
  settings.pid.offset = parseFloat($('#offset').val()) / 100;
}

// Todo: Check input? Empty strings and such.
function putsettings() {
  formtosettings();
  $.post("/settings", JSON.stringify(settings), function(data){ $('#setstatus').text('Updated settings') });
}

function displaysettings() {
  $('input[value='+settings.controlmode+']').attr('checked', true);
  $('#staticDC').val(settings.staticDC.toFixed(3) * 100);
  $('#cycletime').val(settings.cycletime);
  $('#setpoint').val(settings.pid.setpoint.toFixed(1));
  $('#Pfactor').val(settings.pid.P);
  $('#Ifactor').val(settings.pid.I);
  $('#Dfactor').val(settings.pid.D);
  $('#Imax').val(settings.pid.Imax);
  $('#Imin').val(settings.pid.Imin);
  $('#offset').val(settings.pid.offset.toFixed(3) * 100);
}

// Wait for dom to be ready
getsettings();
updatesensors();
window.setInterval(updatesensors, 2000);

$('#updatesettings').click(putsettings);

$('input').focus(function() {$('#setstatus').text('&nbsp;');});
