(function (win) {
  var apiNames = [];
  if (!('Promise' in win)) {
    apiNames.push('Promise');
  }
  if (!('CustomEvent' in win)) {
    apiNames.push('CustomEvent');
  }
  if (!('vr' in navigator)) {
    apiNames.push('vr');
  }

  var addScripts = function (apiNames) {
    var apiName = apiNames.shift();
    if (!apiName) {
      return;
    }

    var script = document.createElement('script');
    script.src = apiName + '-polyfill.js';
    script.async = true;
    script.addEventListener('load', function () {
      addScripts(apiNames);
    });
    script.addEventListener('error', function (event) {
      console.error(event);
    });
    document.head.appendChild(script);
  };

  window.addEventListener('load', function () {
    addScripts(apiNames);
  });
})(self);
