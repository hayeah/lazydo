(function() {
  var L, p, sys;
  L = require("../lib/combinators").Lazy;
  sys = require("sys");
  p = function(o) {
    return sys.puts(sys.inspect(o));
  };
  module.exports = {
    'sets error message': function(a) {
      var l, msg;
      msg = "error";
      l = L(function($) {
        return $.raise(msg);
      });
      return l(function(e) {
        return a.eql(e, msg);
      });
    },
    'returns result': function(a) {
      var l;
      l = L(function($) {
        return $["return"](10);
      });
      return l(function(e, result) {
        a.isUndefined(e);
        return a.eql(result, 10);
      });
    }
  };
}).call(this);
