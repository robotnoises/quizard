(function (window) {
  var qRequest;
  
  // Old compatibility code, no longer needed.
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    qRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
    qRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }

  function handleRequestChange(callback) {
    if (qRequest && qRequest.readyState === 4) {
      var response = qRequest.responseText;
      callback(JSON.parse(response))
    }
  }

  function getStepData(step, callback) {
    var s = step || 'greetings';

    qRequest.open('GET', '/api/getstepdata' + '?step=' + s, true);
    qRequest.onreadystatechange = handleRequestChange.bind(this, callback);
    qRequest.send();
  }

  window.qRequest = window.qRequest || {};
  window.qRequest.getStepData = getStepData;
}(window));
