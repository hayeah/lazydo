(function() {
  var LazyObject;
  LazyObject = function(_arg) {
    this.thunk = _arg;
    this.callbacks = [];
    return this;
  };
  LazyObject.prototype.call = function(callback) {
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
  LazyObject.prototype.eval = function() {
    return this.thunk(this);
  };
  LazyObject.prototype["return"] = function(result) {
    this.result = result;
    return this.complete();
  };
  LazyObject.prototype.raise = function(error) {
    this.error = error;
    return this.complete();
  };
  LazyObject.prototype.complete = function() {
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
  exports.LazyObject = function(thunk) {
    return new LazyObject(thunk);
  };
}).call(this);
