if (typeof window.QNR === 'undefined') {
  window.QNR = {};
}

QNR.Tools = {
  forEach: function(array, action) {
    for (var i = 0; i < array.length; i++) {
      action(array[i]);
    }
  },
  map: function(array, action) {
    var result = [];
    this.forEach(array, function(element) {
      result.push(action(element));
    });
    return result;
  },
  filter: function(array, test) {
    var result = [];
    this.forEach(array, function(element) {
      if (test(element))
        result.push(element);
    });
    return result;
  },
  getUrlValue: function() {
    var keyresult = [];
    decodeURI(location.search).replace(/([^&?]\w+)=(([0-9a-zA-Z+\u4e00-\u9fff]+))/g, function($1, $2, $3, $4, pos, originalText) {
      var test = {};
      var key = $2;
      var value = $3;
      test.key = key;
      test.value = value;
      keyresult.push(test);
    });
    return keyresult;
  }
};
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}