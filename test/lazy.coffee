L = require("../lib/combinators").Lazy

sys = require("sys")
p = (o) ->
  sys.puts(sys.inspect(o))

module.exports = {
  'sets error message': (a) ->
    msg = "error"
    l = L ($) -> $.raise(msg)
    l (e) -> a.eql(e,msg)

  'returns result': (a) ->
    l = L ($) -> $.return(10)
    l (e,result) ->
      a.isUndefined e
      a.eql result, 10

}
