(function() {
  var LO, lazy, p, sys;
  lazy = require("../lib/do");
  LO = function(thunk) {
    return new lazy.LazyObject(thunk);
  };
  sys = require("sys");
  p = function(o) {
    return sys.puts(sys.inspect(o));
  };
  module.exports = {
    'sets error message': function(a) {
      var l, msg;
      msg = "error";
      l = LO(function($) {
        return $.raise(msg);
      });
      return l.call(function(e) {
        return a.eql(e, msg);
      });
    },
    'returns result': function(a) {
      var l;
      l = LO(function($) {
        return $["return"](10);
      });
      return l.call(function(e, result) {
        a.isUndefined(e);
        return a.eql(result, 10);
      });
    },
    'double evaluation should yield same value': function(a) {
      var l, v1, v2;
      l = LO(function($) {
        return $["return"](Math.random());
      });
      v1 = (v2 = null);
      l.call(function(e, result) {
        return (v1 = result);
      });
      l.call(function(e, result) {
        return (v2 = result);
      });
      return a.eql(v1, v2);
    },
    'queues up callbacks if result is not ready': function(a) {
      var capture, l, v1, v2;
      capture = (v1 = (v2 = null));
      l = LO(function($) {
        return (capture = $);
      });
      l.call(function(e, r) {
        return (v1 = r);
      });
      l.call(function(e, r) {
        return (v2 = r);
      });
      a.length(l.callbacks, 2);
      capture["return"](10);
      a.eql(v1, 10);
      a.eql(v2, 10);
      return a.isUndefined(capture.callbacks);
    }
  };
}).call(this);
