(function() {
  var If, L, fail, p, sys;
  If = require("../lib/combinators").If;
  L = require("../lib/combinators").Lazy;
  sys = require("sys");
  p = function(o) {
    return sys.puts(sys.inspect(o));
  };
  fail = L(function($) {
    return $.raise("error");
  });
  module.exports = {
    "true branch": function(a) {
      return If(true, 1, 2)(function(e, r) {
        return a.eql(r, 1);
      });
    },
    "false branch": function(a) {
      return If(false, 1, 2)(function(e, r) {
        return a.eql(r, 2);
      });
    },
    "raises error if any of the executing branches fails": function(a) {
      If(fail, 1, 2)(function(e, r) {
        return a.eql(e, "error");
      });
      If(true, fail, 2)(function(e, r) {
        return a.eql(e, "error");
      });
      return If(false, 1, fail)(function(e, r) {
        return a.eql(e, "error");
      });
    },
    "does not raise error if the branch is non-executing": function(a) {
      If(true, 1, fail)(function(e, r) {
        return a.eql(r, 1);
      });
      return If(false, fail, 2)(function(e, r) {
        return a.eql(r, 2);
      });
    }
  };
}).call(this);
