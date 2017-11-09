function request() {
  var qRequest;
  
  // Old compatibility code, no longer needed.
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    qRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
    qRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }

  return qRequest;
}

function handleRequestChange(req, callback) {
  if (req.readyState === 4) {
    callback(JSON.parse(req.responseText))
  }
}

/**
 * Main
 */

(function (window) {
  function getStepData(step, callback) {
    var req = request();
    var s = step || 'greetings';

    req.open('GET', '/api/getstepdata' + '?step=' + s, true);
    req.onreadystatechange = handleRequestChange.bind(this, req, callback);
    req.send();
  }

  function getConfig(callback) {
    var req = request();
    req.open('GET', '/api/getconfig', true);
    req.onreadystatechange = handleRequestChange.bind(this, req, callback);
    req.send();
  }

  window.qRequest = window.qRequest || {};
  window.qRequest.getStepData = getStepData;
  window.qRequest.getConfig = getConfig;
}(window));
