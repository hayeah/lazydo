lazy = require("../lib/do")
LO = (thunk) -> new lazy.LazyObject(thunk)

sys = require("sys")
p = (o) ->
  sys.puts(sys.inspect(o))

module.exports = {
  'sets error message': (a) ->
    msg = "error"
    l = LO ($) -> $.raise(msg)
    l.call (e) ->
      a.eql(e,msg)

  'returns result': (a) ->
    l = LO ($) -> $.return(10)
    l.call (e,result) ->
      a.isUndefined e
      a.eql result, 10

  'double evaluation should yield same value': (a) ->
    l = LO ($) -> $.return(Math.random())
    v1 = v2 = null
    l.call (e,result) -> v1 = result
    l.call (e,result) -> v2 = result
    a.eql v1, v2

  'queues up callbacks if result is not ready': (a) ->
    capture = v1 = v2 = null
    l = LO ($) -> capture = $
    l.call (e,r) -> v1 = r
    l.call (e,r) -> v2 = r
    a.length(l.callbacks,2)
    capture.return 10
    a.eql v1, 10
    a.eql v2, 10
    a.isUndefined capture.callbacks

}
