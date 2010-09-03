Do = require("../lazydo").Do;

var sys = require('sys');
function p(o) {
  sys.puts(sys.inspect(o));
}

module.exports = {
  // LazyObject
  'sets error message': function(a) {
    var msg = "error message";
    var d = Do(function($) { $.raise(msg) });
    d(function() {
      a.eql(this.error,msg);
    });
  },

  'returns result': function(a) {
    var d = Do(function($) { $.return(10) });
    d(function(result) {
      a.isUndefined(this.error);
      a.eql(result,10);
      a.eql(this.result,result);
    });
  },

  'double evaluation should yield same value': function(a) {
    var d = Do(function($) { $.return(Math.random())});
    var v1, v2;
    d(function(result) {v1 = result});
    d(function(result) {v2 = result});
    a.eql(v1,v2);
  },
  
  'queues up callbacks if result is not ready': function(a) {
    var lazyObj;
    var d = Do(function($) { lazyObj = $ });
    var v1, v2;
    d(function(r) {v1 = r});
    d(function(r) {v2 = r});
    a.length(lazyObj.callbacks,2);
    lazyObj.return(10);
    a.eql(v1,v2);
    a.eql(v1,10);
    a.isUndefined(lazyObj.callbacks);
  }
}

