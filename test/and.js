(function() {
  var And, L, fail, p, sys;
  And = require("../lib/combinators").And;
  L = require("../lib/combinators").Lazy;
  sys = require("sys");
  p = function(o) {
    return sys.puts(sys.inspect(o));
  };
  fail = L(function($) {
    return $.raise("error");
  });
  module.exports = {
    "return first falsey value": function(a) {
      return And(1, null, 0, 1, 2)(function(e, r) {
        return a.eql(r, null);
      });
    },
    "return first truthy value": function(a) {
      return And(1, 2, 3)(function(e, r) {
        return a.eql(r, 3);
      });
    },
    "raises error": function(a) {
      return And(1, fail)(function(e, r) {
        return a.eql(e, "error");
      });
    },
    "does not raise error if short circuited": function(a) {
      return And(false, fail)(function(e, r) {
        a.eql(r, false);
        return a.eql(e, undefined);
      });
    }
  };
}).call(this);
