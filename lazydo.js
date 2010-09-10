var sys = require('sys');
function p(o) {
  sys.puts(sys.inspect(o));
}

module.exports = {
  'Do': Do
}

function Do() {
  if(arguments[0] &&
     arguments[0].constructor === Function
     && arguments.length == 1) {
    return Lazy(arguments[0]);
  } else {
    var doObj = new DoObject(arguments);
    var fn = function(callback) {
      doObj.eval(callback);
    };
    fn.object = doObj;
    fn.constructor = Do;
    return fn;
  }
}

// make this lazy as well
var Lazy = exports.Lazy = function(fn) {
  var $ = new LazyObject(fn);
  var lazy = function(callback) {
    $.eval(callback);
  }
  lazy.constructor = Lazy;
  return lazy;
}

function LazyObject(thunk) {
  this.thunk = thunk;
  this.callbacks = [];
  this.done = false;
}

LazyObject.prototype = {
  eval: function(callback) {
    if(this.in_progress) {
      this.queue(callback);
      return;
    }
    if (this.done) {
      callback.call(this,this.result);
      return
    }
    this.queue(callback);
    this.in_progress = true;
    this.thunk(this);
  },
  queue: function(callback) {
    if(callback) this.callbacks.push(callback);
  },
  
  'return': function(value) {
    this.result = value;
    this.complete();
  },
  
  'raise': function(error) {
    this.error = error;
    this.complete();
  },

  complete: function() {
    this.done = true;
    this.in_progress = false;
    if(this.callbacks) {
      var callback;
      while(callback = this.callbacks.pop()) {
        if(this.error) {
          callback.call(this);
        } else {
          callback.call(this,this.result);
        }
      }
      this.callbacks = undefined;
    }
  }
}
  
function DoObject(args) {
  this.init(args);
}

// lazy
DoObject.prototype = {
  init: function(args) {
    if(args[0] && args[0].constructor == Function) {
      this.fn = args[0];
      this.values = [].slice.call(args,1);
    } else {
      this.values = [].slice.call(args,0);
    }
    this.results = [];
  },

  // left to right evaluation loop
  eval: function(callback) {
    var self = this;
    
    if(this.done) {
      this.complete(callback);
      return;
    };
    
    if(this.values.length == 0) {
      this.values = this.results;
      delete this['results'];
      if(this.fn) {
        try {
          var result = this.fn.apply(this,this.values);
          if(result &&
             (result.constructor === Lazy ||
              result.constructor === Do)) {
            // if the result of the application is another lazy value, evaluate recursively
            result(function(result) {
              if(this.error) {
                self.raise(this.error,callback);
              } else {
                self.fn_result = result;
                self.complete(callback);
              }
            });
          } else {
            // return result of function application
            this.fn_result = result;
            self.complete(callback);
          }
        } catch(error) {
          self.raise(error,callback);
        }
      } else {
        // just returning the evaluated values
        self.complete(callback);
      }
    } else {
      var next = this.values.shift();
      if(next == undefined || next == null) {
        this.results.push(next);
        this.eval(callback);
      } else if(next.constructor === Lazy) {
        // force the lazy value
        next(function(value) {
          if(this.error) {
            self.raise(this.error,callback);
          } else {
            self.results.push(value);
            self.eval(callback);
          }
        });
      } else if(next.constructor === Do) {
        next(function() {
          if(this.error) {
            self.raise(this.error);
          } else {
            if(this.fn) {
              self.results.push(this.fn_result);
            } else {
              self.results.push(this.values);
            }
            self.eval(callback);
          }
        });
      } else {
        this.results.push(next);
        this.eval(callback);
      }
    }
  },

  raise: function(error,callback) {
    this.error = error;
    this.complete(callback);
  },
  
  complete: function(callback) {
    this.done = true;
    if(callback) {
      if(this.error) {
        callback.call(this);
      } else if(this.fn_result) {
        // Do(fn(v1,v2) {},2,3)(function(result) { })
        callback.call(this,this.fn_result);
      } else {
        // Do(1,2,3)(function(v1,v2,v3) { })
        callback.apply(this,this.values);
      }
    } // else do nothing. we were just forcing the lazy evaluation
  }
}
