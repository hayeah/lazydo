(function() {
  var Apply, Call, L, fail, fn, p, sys;
  var __slice = Array.prototype.slice;
  Apply = require("../lib/combinators").Apply;
  Call = require("../lib/combinators").Call;
  L = require("../lib/combinators").Lazy;
  sys = require("sys");
  p = function(o) {
    return sys.puts(sys.inspect(o));
  };
  fail = L(function($) {
    return $.raise("error");
  });
  fn = L(function($) {
    return $["return"](function(a) {
      return a;
    });
  });
  module.exports = {
    "apply function with object as context": function(a) {
      var l, o;
      o = {};
      l = Apply(o, function(a, b) {
        this.a = a;
        this.b = b;
        return this;
      }, [1, 2]);
      return l(function(e, r) {
        a.eql(r.a, 1);
        return a.eql(r.b, 2);
      });
    },
    "apply the first lazy value as function": function(a) {
      var l;
      l = Apply({}, fn, [1]);
      return l(function(e, r) {
        return a.eql(r, 1);
      });
    },
    "forces the value the application returned": function(a) {
      var l, v;
      v = L(function($) {
        return $["return"](10);
      });
      l = Apply({}, function() {
        return v;
      }, []);
      return l(function(e, r) {
        return a.eql(r, 10);
      });
    },
    "if fn is a string, assumes it names the property of the context object as function": function(a) {
      var l, o;
      o = {};
      o.a = 10;
      o.fn = function() {
        return this.a;
      };
      l = Apply(o, "fn", []);
      return l(function(e, r) {
        return a.eql(r, 10);
      });
    },
    "call function with variable length arguments": function(a) {
      var l;
      l = Call({}, function() {
        var args;
        args = __slice.call(arguments, 0);
        return args;
      }, 1, 2, 3);
      return l(function(e, r) {
        return a.eql(r, [1, 2, 3]);
      });
    }
  };
}).call(this);
