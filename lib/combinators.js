(function() {
  var And, Apply, Call, Do, If, Lazy, LazyEval, Let, Not, Or, loop_breaker, p, secret_tag_value, sys, wrap;
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
  secret_tag_value = {};
  loop_breaker = {};
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
      this.report(callback);
    }
    this.in_progress = undefined;
    return (this.callbacks = undefined);
  };
  LazyEval.prototype.report = function(callback) {
    return callback(this.error, this.result);
  };
  LazyEval.prototype.force = function(object, callback) {
    return this.isLazy(object) ? object(__bind(function(error, result) {
      return error ? this.raise(error) : this.force(result, callback);
    }, this)) : callback(object);
  };
  LazyEval.prototype.isLazy = function(object) {
    return (typeof object !== "undefined" && object !== null) && object.lazy === secret_tag_value;
  };
  LazyEval.prototype.each = function(args, callback, i) {
    if (!(typeof i !== "undefined" && i !== null)) {
      return (this.each(args, callback, 0));
    }
    return i < args.length ? this.force(args[i], __bind(function(result) {
      try {
        callback(result);
        return this.each(args, callback, i + 1);
      } catch (e) {
        if (e !== loop_breaker) {
          throw (e);
        }
      }
    }, this)) : null;
  };
  LazyEval.prototype.map = function(args, callback) {
    var _ref, values;
    values = [];
    this.each(args, function(result) {
      return values.push(result);
    });
    if (!(typeof (_ref = this.error) !== "undefined" && _ref !== null)) {
      return callback(values);
    }
  };
  LazyEval.prototype["break"] = function() {
    throw (loop_breaker);
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
    this.args = args;
    Do.__super__.constructor.apply(this, arguments);
    return this;
  };
  __extends(Do, LazyEval);
  Do.prototype.eval = function() {
    return this.each(this.args, function(result) {
      return (this.value = result);
    });
  };
  Not = function(_arg) {
    this.value = _arg;
    Not.__super__.constructor.apply(this, arguments);
    return this;
  };
  __extends(Not, LazyEval);
  Not.prototype.eval = function() {
    return this.force(this.value, __bind(function(result) {
      return this["return"](!result);
    }, this));
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
  Or = function() {
    var args;
    args = __slice.call(arguments, 0);
    this.args = args;
    Or.__super__.constructor.apply(this, arguments);
    return this;
  };
  __extends(Or, LazyEval);
  Or.prototype.eval = function() {
    var _ref;
    this.value = false;
    this.each(this.args, __bind(function(result) {
      this.value = result;
      return result ? this["break"]() : null;
    }, this));
    if (!(typeof (_ref = this.error) !== "undefined" && _ref !== null)) {
      return this["return"](this.value);
    }
  };
  And = function() {
    var args;
    args = __slice.call(arguments, 0);
    this.args = args;
    And.__super__.constructor.apply(this, arguments);
    return this;
  };
  __extends(And, LazyEval);
  And.prototype.eval = function() {
    var _ref;
    this.value = true;
    this.each(this.args, __bind(function(result) {
      this.value = result;
      if (!result) {
        return this["break"]();
      }
    }, this));
    if (!(typeof (_ref = this.error) !== "undefined" && _ref !== null)) {
      return this["return"](this.value);
    }
  };
  Let = function() {
    var args;
    args = __slice.call(arguments, 0);
    this.args = args;
    Let.__super__.constructor.apply(this, arguments);
    return this;
  };
  __extends(Let, LazyEval);
  Let.prototype.eval = function() {
    this.bindings = {};
    return this.eval_all(0);
  };
  Let.prototype.report = function(callback) {
    return callback.call(this.bindings, this.error, this.bindings);
  };
  Let.prototype.eval_all = function(i) {
    var name, val;
    if (i >= this.args.length) {
      return this["return"](this.bindings);
    } else {
      name = this.args[i];
      val = this.args[i + 1];
      return this.force(val, __bind(function(result) {
        this.bindings[name] = result;
        return this.eval_all(i + 2);
      }, this));
    }
  };
  Apply = function(_arg, _arg2, _arg3) {
    this.args = _arg3;
    this.fn = _arg2;
    this.context = _arg;
    Apply.__super__.constructor.apply(this, arguments);
    return this;
  };
  __extends(Apply, LazyEval);
  Apply.prototype.eval = function() {
    return this.map([this.context, this.fn], __bind(function(values) {
      var _ref, context, fn;
      _ref = values;
      context = _ref[0];
      fn = _ref[1];
      if (typeof (fn) === 'string') {
        fn = context[fn];
      }
      return this.map(this.args, __bind(function(args) {
        var value;
        value = fn.apply(context, args);
        return this.force(value, __bind(function(result) {
          return this["return"](result);
        }, this));
      }, this));
    }, this));
  };
  Call = function(context, fn) {
    var args;
    args = __slice.call(arguments, 2);
    Call.__super__.constructor.call(this, context, fn, args);
    return this;
  };
  __extends(Call, Apply);
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
  exports.Not = wrap(Not);
  exports.Or = wrap(Or);
  exports.And = wrap(And);
  exports.Let = wrap(Let);
  exports.Apply = wrap(Apply);
  exports.Call = wrap(Call);
}).call(this);
