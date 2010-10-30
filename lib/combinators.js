(function() {
  var Do, If, Lazy, LazyEval, Let, p, secret_tag_value, sys, wrap;
  var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  }, __extends = function(child, parent) {
    var ctor = function(){};
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.prototype.constructor = child;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  }, __slice = Array.prototype.slice;
  sys = require("sys");
  p = function(o) {
    return sys.puts(sys.inspect(o));
  };
  secret_tag_value = function() {};
  LazyEval = function() {
    this.callbacks = [];
    return this;
  };
  LazyEval.prototype.call = function(callback) {
    if (this.done) {
      if (callback) {
        return callback(this.error, this.result);
      }
    } else {
      if (callback) {
        this.callbacks.push(callback);
      }
      if (!(this.in_progress)) {
        this.in_progress = true;
        return this.eval();
      }
    }
  };
  LazyEval.prototype["return"] = function(result) {
    this.result = result;
    return this.complete();
  };
  LazyEval.prototype.raise = function(error) {
    this.error = error;
    return this.complete();
  };
  LazyEval.prototype.complete = function() {
    var _i, _len, _ref, callback;
    this.done = true;
    _ref = this.callbacks;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      callback = _ref[_i];
      callback(this.error, this.result);
    }
    this.in_progress = undefined;
    return (this.callbacks = undefined);
  };
  LazyEval.prototype.force = function(object, callback) {
    return this.isLazy(object) ? object(__bind(function(error, result) {
      return error ? this.raise(error) : this.force(result, callback);
    }, this)) : callback(object);
  };
  LazyEval.prototype.isLazy = function(object) {
    return (typeof object !== "undefined" && object !== null) && object.lazy === secret_tag_value;
  };
  LazyEval.prototype.eval = function() {};
  Lazy = function(_arg) {
    this.thunk = _arg;
    Lazy.__super__.constructor.apply(this, arguments);
    return this;
  };
  __extends(Lazy, LazyEval);
  Lazy.prototype.eval = function() {
    return this.thunk(this);
  };
  Do = function() {
    var args;
    args = __slice.call(arguments, 0);
    this.values = [];
    this.args = args;
    Do.__super__.constructor.apply(this, arguments);
    return this;
  };
  __extends(Do, LazyEval);
  Do.prototype.eval = function() {
    var arg;
    if (this.args.length === 0) {
      return this["return"](this.value);
    } else {
      arg = this.args.shift();
      return this.force(arg, __bind(function(result) {
        this.value = result;
        return this.eval();
      }, this));
    }
  };
  If = function(_arg, _arg2, _arg3) {
    this.b = _arg3;
    this.a = _arg2;
    this.test = _arg;
    If.__super__.constructor.apply(this, arguments);
    return this;
  };
  __extends(If, LazyEval);
  If.prototype.eval = function() {
    return this.force(this.test, __bind(function(test) {
      return test ? this.force(this.a, __bind(function(result) {
        return this["return"](result);
      }, this)) : this.force(this.b, __bind(function(result) {
        return this["return"](result);
      }, this));
    }, this));
  };
  Let = function(_arg) {
    this.args = _arg;
    Let.__super__.constructor.apply(this, arguments);
    return this;
  };
  __extends(Let, LazyEval);
  Let.prototype.eval = function() {
    this.values = [];
    return eval_all(callback, 0);
  };
  Let.prototype.eval_all = function(callback, i) {
    return i > args.length ? this["return"](this.values) : arg[0](__bind(function(error, result) {
      this.values.push(result);
      return this.eval_all(callback, i + 1);
    }, this));
  };
  wrap = function(klass) {
    return function() {
      var args, fn, object;
      args = __slice.call(arguments, 0);
      object = new klass();
      klass.apply(object, args);
      fn = function(callback) {
        return object.call(callback);
      };
      fn.lazy = secret_tag_value;
      return fn;
    };
  };
  exports.LetObject = Lazy;
  exports.LazyObject = Let;
  exports.Lazy = wrap(Lazy);
  exports.If = wrap(If);
  exports.Do = wrap(Do);
}).call(this);
