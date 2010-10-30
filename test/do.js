(function() {
  var Do, L, fail, p, sys;
  Do = require("../lib/combinators").Do;
  L = require("../lib/combinators").Lazy;
  sys = require("sys");
  p = function(o) {
    return sys.puts(sys.inspect(o));
  };
  fail = L(function($) {
    return $.raise("error");
  });
  module.exports = {
    "evaluate each value in order": function(a) {
      var i, l1, l2, l3, v1, v2, v3;
      i = 0;
      v1 = (v2 = (v3 = null));
      l1 = L(function($) {
        return $["return"](v1 = ++i);
      });
      l2 = L(function($) {
        return $["return"](v2 = ++i);
      });
      l3 = L(function($) {
        return $["return"](v3 = ++i);
      });
      Do(l1, l2, l3)();
      a.eql(v1, 1);
      a.eql(v2, 2);
      return a.eql(v3, 3);
    },
    "fails if anything fails": function(a) {
      Do(fail, 1)(function(e) {
        return a.eql(e, "error");
      });
      return Do(1, fail)(function(e) {
        return a.eql(e, "error");
      });
    },
    "does not evaluate anything after failure": function(a) {
      var l, trap;
      trap = null;
      l = L(function($) {
        return $["return"](trap = true);
      });
      Do(fail, l)(function(e) {
        return a.eql(e, "error");
      });
      return a.isNull(trap);
    }
  };
}).call(this);
