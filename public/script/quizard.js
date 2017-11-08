(function (window) {
  var request = window.qRequest;

  request.getStepData('greetings.yml', function (response) {
    console.log(response);
  });
}(window));
