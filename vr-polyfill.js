/* global CustomEvent, localStorage */
(function (win) {
  if ('vr' in navigator) {
    return navigator.vr;
  }

  var URL_REFERRING_DISPLAYS_HOST = 'http://localhost:4000';
  var URL_REFERRING_DISPLAYS = URL_REFERRING_DISPLAYS_HOST + '/referringDisplays.html';

/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */
function EventDispatcher () {}
Object.assign(EventDispatcher.prototype, {
  addEventListener: function (type, listener ) {
    if ( this._listeners === undefined ) this._listeners = {};
    var listeners = this._listeners;
    if ( listeners[ type ] === undefined ) {
      listeners[ type ] = [];
    }
    if ( listeners[ type ].indexOf( listener ) === - 1 ) {
      listeners[ type ].push( listener );
    }
  },

  hasEventListener: function ( type, listener ) {
    if ( this._listeners === undefined ) return false;

    var listeners = this._listeners;

    return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;

  },

  removeEventListener: function ( type, listener ) {

    if ( this._listeners === undefined ) return;

    var listeners = this._listeners;
    var listenerArray = listeners[ type ];

    if ( listenerArray !== undefined ) {

      var index = listenerArray.indexOf( listener );

      if ( index !== - 1 ) {

        listenerArray.splice( index, 1 );

      }

    }

  },

  dispatchEvent: function ( event ) {
    if ( this._listeners === undefined ) return;

    var listeners = this._listeners;
    var listenerArray = listeners[ event.type ];

    if ( listenerArray !== undefined ) {
      event.target = this;

      var array = [], i = 0;
      var length = listenerArray.length;

      for ( i = 0; i < length; i ++ ) {
        array[ i ] = listenerArray[ i ];
      }

      for ( i = 0; i < length; i ++ ) {
        array[ i ].call( this, event );
      }
    }
  }
} );

  var vr = {};

  var oldAvailability = null;
  var newAvailability = null;

  var oldReferringDisplays = null;
  var newReferringDisplays = null;

  win.addEventListener('message', function (e) {
    // localStorage.referringDisplays = e.data;
    oldReferringDisplays = e.data;
    console.log('oldReferringDisplays, message', e.data);
  });

  var iframe = document.createElement('iframe');
  iframe.src = URL_REFERRING_DISPLAYS;
  iframe.addEventListener('load', function () {
    console.log('iframe loaded');
  });
  document.head.appendChild(iframe);

  vr.getReferringDisplays = function () {
    return new Promise(function (resolve, reject) {
      win.addEventListener('message', function (e) {
        // localStorage.referringDisplays = e.data;
        console.log('message', e.data);
      });
    });
  };

  win.addEventListener('beforeunload', function () {
    // localStorage.referringDisplays = vr.referringDisplays;
    win.postMessage('referringDisplays:set', URL_REFERRING_DISPLAYS_HOST);
  });

  win.postMessage('referringDisplays:get', URL_REFERRING_DISPLAYS_HOST);

  vr.referringDisplays = {};

  vr.getDisplays = navigator.getVRDisplays;

  var createVRDisplayEvent = function (type, display, reason) {
    var event = new CustomEvent(type);
    event.display = display;
    event.reason = reason;
    return event;
  };

  // var VRDisplayConstructor = VRDisplay.prototype.constructor;
  // Object.assign(VRDisplay.prototype, EventDispatcher.prototype);
  // VRDisplay.prototype.constructor = function () {
  //   VRDisplayConstructor();
  //   EventTarget.prototype.constructor();
  // };
  // VRDisplay.prototype.isValid = false;
  // VRDisplay.prototype.addEventListener = EventTarget.prototype.addEventListener;
  // VRDisplay.prototype.dispatchEvent = EventTarget.prototype.dispatchEvent;
  // VRDisplay.prototype.removeEventListener = EventTarget.prototype.removeEventListener;

  // var display = new VRDisplay({
  //   name: 'Oculus Rift',
  //   features: {},
  //   leftEye: {},
  //   rightEye: {},
  //   resolution: {}
  // });

  if ('vrEnabled' in navigator) {
    var navigatorHandler = {
      set: function (obj, prop, value) {
        if (prop === 'vrEnabled') {
          newAvailability = value;
          if (oldAvailability !== newAvailability) {
            oldAvailability = value;
            console.log('setting to', value);
            vr.dispatchEvent('availabilitychanged');
          }
        }

        obj[prop] = value;

        return true;
      }
    };
    var p = new Proxy(navigator, navigatorHandler);
  }

  vr.getAvailability = function () {
    if ('vrEnabled' in navigator) {
      return Promise.resolve(navigator.vrEnabled);
    }
    return Promise.resolve(newAvailability);
  };

  vr.getAvailability().then(d => {
    console.log('calling navigator.getAvailability', d);
  });

  // navigator.vr.addEventListener('displayvaluechanged');

  var displays = {};

  // vr.requestPresent();
  // vr.addEventListener('displayconnected');

  // vr.getAvailability().then(function (isAvailable) {
  // });
  // vr.addEventListener('availabilitychanged', function () {
  // });

  win.addEventListener('vrdisplayconnect', function (event) {
    navigator.getVRDisplays().then(d => {
    });

    if (event && event.display) {
    }
  });

  win.addEventListener('vrdisplaydisconnect', function (event) {
  });

  win.addEventListener('vrdisplayactivate', function (event) {
  });

  win.addEventListener('vrdisplaydeactivate', function (event) {
  });

  win.addEventListener('vrdisplayblur', function (event) {
  });

  win.addEventListener('vrdisplayfocus', function (event) {
  });

  win.addEventListener('vrdisplaypresentchange', function (event) {
  });

  navigator.vr = vr;

  return vr;
})(self);

// TODO: `canPresent`
// Presenting is rendering
