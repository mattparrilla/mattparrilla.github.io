window.addEventListener("load", function () {
  var form = document.getElementById("email_form");

  function sendData() {
    var XHR = new XMLHttpRequest();

    // Bind the FormData object and the form element
    var FD = new FormData(form);


    // Set up our request
    XHR.open("POST", "https://5r16enkcob.execute-api.us-east-1.amazonaws.com/api/");
    XHR.setRequestHeader("content-type", "application/json");

    // The data sent is what the user provided in the form
    var json = {};
    FD.forEach((value, key) => { json[key] = value; });
    XHR.onreadystatechange = function () {
      var onSubmit = document.getElementById("email_response");
      if (XHR.readyState === 4) {
        if (XHR.status === 200) {
          document.getElementById('email').value = '';
          onSubmit.innerHTML = "Sent";
        } else {
          onSubmit.innerHTML = "Oops. Something is wrong.";
        }
      }
    };
    XHR.send(JSON.stringify(json));
  }
  // ...and take over its submit event.
  form.addEventListener("submit", function (event) {
      event.preventDefault();
      sendData();
  });
});
