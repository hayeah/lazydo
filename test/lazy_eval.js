(function() {
  var Do, L, fail, p, random, sys;
  Do = require("../lib/combinators").Do;
  L = require("../lib/combinators").Lazy;
  sys = require("sys");
  p = function(o) {
    return sys.puts(sys.inspect(o));
  };
  fail = L(function($) {
    return $.raise("error");
  });
  random = L(function($) {
    return $["return"](Math.random());
  });
  module.exports = {
    "evals an eager as it is": function(a) {
      return Do(1)(function(e, r) {
        return a.eql(r, 1);
      });
    },
    "gives error": function(a) {
      return Do(fail)(function(e, r) {
        return a.eql(e, "error");
      });
    },
    "evals a lazy value by forcing it": function(a) {
      var l;
      l = L(function($) {
        return $["return"](10);
      });
      return Do(l)(function(e, r) {
        return a.eql(r, 10);
      });
    },
    "a lazy value is evaled once and memoized": function(a) {
      var v1, v2;
      v1 = (v2 = null);
      Do(random)(function(e, r) {
        return (v1 = r);
      });
      Do(random)(function(e, r) {
        return (v2 = r);
      });
      return a.eql(v1, v2);
    },
    "lazy values are recursively evaled": function(a) {
      var v1, v2, v3;
      v1 = L(function($) {
        return $["return"](1);
      });
      v2 = L(function($) {
        return $["return"](v1);
      });
      v3 = L(function($) {
        return $["return"](v2);
      });
      return Do(v3)(function(e, r) {
        return a.eql(r, 1);
      });
    },
    "callbacks wait until lazy value is ready": function(a) {
      var $, l, r1, r2;
      $ = (r1 = (r2 = null));
      l = L(function($2) {
        return ($ = $2);
      });
      Do(l)(function(e, r) {
        return (r1 = r);
      });
      Do(l)(function(e, r) {
        return (r2 = r);
      });
      $["return"](Math.random());
      return a.eql(r1, r2);
    }
  };
}).call(this);
