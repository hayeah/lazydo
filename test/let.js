(function() {
  var L, Let, fail, p, sys;
  Let = require("../lib/combinators").Let;
  L = require("../lib/combinators").Lazy;
  sys = require("sys");
  p = function(o) {
    return sys.puts(sys.inspect(o));
  };
  fail = L(function($) {
    return $.raise("error");
  });
  module.exports = {
    "bindings pass into callback": function(a) {
      return Let("a", 1, "b", 2)(function(e, bindings) {
        return a.eql(bindings, {
          a: 1,
          b: 2
        });
      });
    },
    "callback called with bindings as context": function(a) {
      return Let("a", 1, "b", 2)(function() {
        return a.eql(this, {
          a: 1,
          b: 2
        });
      });
    },
    "evals in order": function(a) {
      var i, v1, v2;
      i = 0;
      v1 = L(function($) {
        return $["return"](++i);
      });
      v2 = L(function($) {
        return $["return"](++i);
      });
      return Let("a", v1, "b", v2)(function() {
        a.eql(this.a, 1);
        return a.eql(this.b, 2);
      });
    },
    "raises error": function(a) {
      return Let("a", 1, "b", fail)(function(e) {
        return a.eql(e, "error");
      });
    }
  };
}).call(this);
