(function() {
  var LazyEval, LazyObject, LetObject;
  var __extends = function(child, parent) {
    var ctor = function(){};
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.prototype.constructor = child;
    if (typeof parent.extended === "function") parent.extended(child);
    child.__super__ = parent.prototype;
  }, __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
  LazyEval = function() {
    this.callbacks = [];
    return this;
  };
  LazyEval.prototype.call = function(callback) {
    if (this.done) {
      return callback(this.error, this.result);
    } else {
      this.callbacks.push(callback);
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
  LazyEval.prototype.eval = function() {};
  LazyObject = function(_arg) {
    this.thunk = _arg;
    LazyObject.__super__.constructor.apply(this, arguments);
    return this;
  };
  __extends(LazyObject, LazyEval);
  LazyObject.prototype.eval = function() {
    return this.thunk(this);
  };
  LetObject = function(_arg) {
    this.args = _arg;
    LetObject.__super__.constructor.apply(this, arguments);
    return this;
  };
  LetObject.prototype.eval = function(callback) {
    this.values = [];
    return eval_all(callback, 0);
  };
  LetObject.prototype.eval_all = function(callback, i) {
    return i > args.length ? this["return"](this.values) : arg[0](__bind(function(error, result) {
      if (error) {
        return this.raise(error);
      } else {
        this.values.push(result);
        return this.eval_all(callback, i + 1);
      }
    }, this));
  };
  exports.LetObject = LetObject;
  exports.LazyObject = LazyObject;
}).call(this);
