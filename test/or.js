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
    },
    "return last falsey value": function(a) {
      return Or(undefined, null)(function(e, r) {
        return a.eql(r, null);
      });
    },
    "raises error": function(a) {
      Or(null, false, fail)(function(e, r) {
        return a.eql(e, "error");
      });
      return Or(null, fail, false)(function(e, r) {
        return a.eql(e, "error");
      });
    },
    "does not raise error if short circuited": function(a) {
      return Or(1, fail)(function(e, r) {
        a.eql(e, undefined);
        return a.eql(r, 1);
      });
    }
  };
}).call(this);
