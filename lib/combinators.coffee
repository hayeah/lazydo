# i do you do
# should i try a bunch of combinators?
# Lazy
# Call(fn,a,b,c)
# If(test,b,c)
# Unless(test,b,c)
# If(Not(test),b,c)

# Let({a: v1, b: v2}) () -> @a == v1; @b == v2
# Let(a,b,c,d) (a,b,c,d) -> ...

# Do(a,b,c,d) # returns d
# Later Do(a,(($,val) -> $.return(do_something(val))),b,c,d)

# class DoObject
#   constructor: (args) ->
sys = require("sys")

p = (o) ->
  sys.puts(sys.inspect(o))

secret_tag_value = () ->

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
      callback(@error,@result)
    @in_progress = undefined
    @callbacks = undefined
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
  eval: () ->
    # to override


class Lazy extends LazyEval
  constructor: (@thunk) ->
    super
  eval: () ->
    @thunk(this)

class Do extends LazyEval
  constructor: (args...) ->
    @values = []
    @args = args
    super
  eval: () ->
    if @args.length == 0
      @return @value
    else
      arg = @args.shift()
      @force arg, (result) =>
        @value = result
        @eval()

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


class Let extends LazyEval
  constructor: (@args) ->
    super
  eval: () ->
    @values = []
    eval_all(callback,0)
  eval_all: (callback,i) ->
    if i > args.length
      @return(@values)
    else
      arg[0] (error,result) =>
        @values.push result
        @eval_all(callback,i+1)

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
