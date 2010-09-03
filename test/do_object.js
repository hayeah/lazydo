Do = require("../lazydo").Do;

var sys = require('sys');
function p(o) {
  sys.puts(sys.inspect(o));
}

module.exports = {
  'returns error is any of its arguments is a failed lazy value': function(a) {
    var error = "oops";
    var v = Do(function($) {$.raise(error)});
    Do(v,2,3)(function() {
      a.isDefined(this.error);
      a.eql(this.error,error);
    });
    Do(1,v,3)(function() { a.eql(this.error,error) });
    Do(1,2,v)(function() { a.eql(this.error,error) });
  },

  'yields lazy values': function(a) {
    var v = Do(function($) {$.return(10)});
    var d = Do(v,v);
    d(function(x,y) {
      a.eql(x,10);
      a.eql(y,10);
    });
  },

  'yields arrays if the subdo expression are array of values': function(a) {
    var v1 = Do(1,2);
    var v2 = Do(3,4);
    Do(v1,v2)(function(x,y) {
      a.eql(x,[1,2]);
      a.eql(y,[3,4]);
    });
  },
  
  'yields single values if the subdo expression are function applications': function(a) {
    var v1 = Do(function(x) {return x},1);
    var v2 = Do(function(x) {return x},2);
    var d = Do(v1,v2);
    d(function(x,y) {
      a.eql(x,1);
      a.eql(y,2);
    },v1,v2);
  },

  'yields arrays if the subdo expression are array of values': function(a) {
    var error = Error("side effect");
    var v1 = Do(function(x) {throw error},1);
    Do(v1)(function() {
      a.eql(this.error,error);
    });
  },

  'recursively evaluates lazy values on function application': function(a) {
    Do(function(n) {
      return Do(1+n);
    },1)(function(n) {
      a.eql(n,2);
    });
  },

  'recursively evaluates a lazy values that raises': function(a) {
    Do(function(n) {
      return Do(function($) {
        $.raise("error");
      });
    },1)(function(n) {
      a.eql(this.error,"error");
    });
  },

  'returns eager values as they are': function(a) {
    Do(1,2)(function(x,y) {
      a.eql(x,1);
      a.eql(y,2);
    });
  },

  'head function application': function(a) {
    var d = Do(function(x,y) {
      a.eql(x,1);
      a.eql(y,2);
      return x + y;
    },1,2);
    d(function(result) {
      a.eql(result,3);
    });
  },

  'catches error of function application': function(a) {
    var d = Do(function(x) {
      throw Error("oh noes!")
    },1);
    d(function() {
      a.isDefined(this.error);
    });
  },

  'memoizes result': function(a) {
    var i = 0;
    var d = Do(function(x) {
      i++;
      return x;
    },1);
    d(function(result) {
      a.eql(result,1);
    });
    d(function(result) {
      a.eql(result,1);
    });
    a.eql(i,1);
  },

  'forces value': function(a) {
    var d = Do(1);
    d();
    a.ok(d.object.done);
    a.eql(d.object.values,[1]);
  },
  
}

