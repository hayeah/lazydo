
# i do you do
# should i try a bunch of combinators?
# Lazy
# Call(fn,a,b,c)
# If(test,b,c)
# Unless(test,b,c)

# Let({a: v1, b: v2}) () -> @a == v1; @b == v2
# Let(a,b,c,d) (a,b,c,d) -> ...

# Do(a,b,c,d) # returns d
# Later Do(a,(($,val) -> $.return(do_something(val))),b,c,d)

# class DoObject
#   constructor: (args) ->

class LazyEval
  constructor: () ->
    @callbacks = []
  call: (callback) ->
    if @done
      callback(@error,@result)
    else
      @callbacks.push(callback)
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

  eval: () ->

class LazyObject extends LazyEval
  constructor: (@thunk) ->
    super
  eval: () ->
    @thunk(this)


class LetObject
  constructor: (@args) ->
    super
  eval: (callback) ->
    @values = []
    eval_all(callback,0)
  eval_all: (callback,i) ->
    if i > args.length
      @return(@values)
    else
      arg[0] (error,result) =>
        if error
          @raise(error)
        else
          @values.push result
          @eval_all(callback,i+1)

exports.LetObject = LetObject
exports.LazyObject = LazyObject