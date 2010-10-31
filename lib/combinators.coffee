# i do you do
# should i try a bunch of combinators?
# Lazy
# Call(fn,a,b,c)
# If(test,b,c)
# Unless(test,b,c)
# If(Not(test),b,c)
# Or
# And

# Let("a",v1,"b",v2) () -> @a
# Let(a,b,c,d) (a,b,c,d) -> ...

# Do(a,b,c,d) # returns d
# Later Do(a,(($,val) -> $.return(do_something(val))),b,c,d)

# class DoObject
#   constructor: (args) ->
sys = require("sys")

p = (o) ->
  sys.puts(sys.inspect(o))

secret_tag_value = {}
loop_breaker = {}

class LazyEval
  constructor: () ->
    @callbacks = []
  call: (callback) ->
    # if no callback is given, we just force evaluation, or do nothing
    if @done
      callback(@error,@result) if callback
    else
      @callbacks.push(callback) if callback
      unless @in_progress
        @in_progress = true
        @eval()
  return: (result) ->
    @result = result
    @complete()
  raise: (error) ->
    @error = error
    @complete()
  complete: () ->
    @done = true
    for callback in @callbacks
      @report(callback)
    @in_progress = undefined
    @callbacks = undefined
  # override this to report back to callback in a different way
  report: (callback) ->
    callback(@error,@result)
  # this is an internal helper
  force: (object,callback) ->
    if @isLazy(object)
      # this is a lazy value created by lazydo
      object (error,result) =>
        if error
          @raise error
        else
          # if result is lazy, it will be recursively evaled
          @force result, callback
    else
      callback(object)
  isLazy: (object) ->
    object? && object.lazy == secret_tag_value
  each: (args,callback,i) ->
    return(@each(args,callback,0)) unless i?
    if i < @args.length
      @force args[i], (result) =>
        try
          callback(result)
          @each(args,callback,i+1)
        catch e
          throw(e) unless e == loop_breaker
  break: () ->
    throw(loop_breaker)
  eval: () ->
    # to override


class Lazy extends LazyEval
  constructor: (@thunk) ->
    super
  eval: () ->
    @thunk(this)

class Do extends LazyEval
  constructor: (args...) ->
    @args = args
    super
  eval: () ->
    @each @args, (result) ->
      @value = result


class Not extends LazyEval
  constructor: (@value) -> super
  eval: () ->
    @force @value, (result) =>
      @return !result

class If extends LazyEval
  constructor: (@test,@a,@b) ->
    super
  eval: () ->
    @force @test, (test) =>
      if test
        @force @a, (result) =>
          @return result
       else
        @force @b, (result) =>
          @return result

class Or extends LazyEval
  constructor: (args...) ->
    @args = args
    super
  eval: () ->
    @value = false
    @each @args, (result) =>
      @value = result
      if result
        @break()
    @return @value unless @error?

class And extends LazyEval
  constructor: (args...) ->
    @args = args
    super
  eval: () ->
    @value = true
    @each @args, (result) =>
      @value = result
      @break() if !result
    @return @value unless @error?

class Let extends LazyEval
  constructor: (args...) ->
    @args = args
    super
  eval: () ->
    @bindings = {}
    @eval_all(0)
  report: (callback) ->
    callback.call @bindings, @error, @bindings
  eval_all: (i) ->
    if i >= @args.length
      @return @bindings
    else
      name = @args[i]
      val = @args[i+1]
      @force val, (result) =>
        @bindings[name] = result
        @eval_all i+2

# isn't functional programming great?
wrap = (klass) ->
  (args...) ->
    # HACK. We construct the object twice, once
    # with nulls, once with the actual
    # arguments. This is the only way I can think
    # of to construct a new object from a dynamically specified class
    object = new klass()
    klass.apply(object,args)
    fn = (callback) -> object.call(callback)
    fn.lazy = secret_tag_value
    fn

exports.LetObject = Lazy
exports.LazyObject = Let

exports.Lazy = wrap(Lazy)
exports.If = wrap(If)
exports.Do = wrap(Do)
exports.Not = wrap(Not)
exports.Or = wrap(Or)
exports.And = wrap(And)
exports.Let = wrap(Let)

