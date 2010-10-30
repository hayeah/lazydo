(function() {
  var L, Or, fail, p, sys;
  Or = require("../lib/combinators").Or;
  L = require("../lib/combinators").Lazy;
  sys = require("sys");
  p = function(o) {
    return sys.puts(sys.inspect(o));
  };
  fail = L(function($) {
    return $.raise("error");
  });
  module.exports = {
    "return first non-false value": function(a) {
      return Or(undefined, null, 0, 1, 2)(function(e, r) {
        return a.eql(r, 1);
      });
    }
  };
}).call(this);
