(function() {
  var L, Not, f, fail, p, sys, t;
  Not = require("../lib/combinators").Not;
  L = require("../lib/combinators").Lazy;
  sys = require("sys");
  p = function(o) {
    return sys.puts(sys.inspect(o));
  };
  fail = L(function($) {
    return $.raise("error");
  });
  t = L(function($) {
    return $["return"](true);
  });
  f = L(function($) {
    return $["return"](false);
  });
  module.exports = {
    "negate return value": function(a) {
      Not(t)(function(e, r) {
        return a.eql(r, false);
      });
      return Not(f)(function(e, r) {
        return a.eql(r, true);
      });
    }
  };
}).call(this);
