class LazyObject
  constructor: (@thunk) ->
    @callbacks = []
  call: (callback) ->
    if @done
      callback(@error,@result)
    else
      @callbacks.push(callback)
      unless @in_progress
        @in_progress = true
        @thunk(this)
  return: (result) ->
    @result = result
    @_complete()
  raise: (error) ->
    @error = error
    @_complete()
  _complete: () ->
    @done = true
    for callback in @callbacks
      callback(@error,@result)
    @in_progress = undefined
    @callbacks = undefined

exports.LazyObject = (thunk) -> new LazyObject(thunk)




