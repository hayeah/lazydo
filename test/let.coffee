Let = require("../lib/combinators").Let
L = require("../lib/combinators").Lazy

sys = require("sys")
p = (o) ->
  sys.puts(sys.inspect(o))

fail = L ($) -> $.raise("error")

module.exports = {
  "bindings pass into callback": (a) ->
    Let("a",1,"b",2) (e,bindings) ->
      a.eql bindings, {a: 1, b: 2}

  "callback called with bindings as context": (a) ->
    Let("a",1,"b",2) () ->
      a.eql this, {a: 1, b: 2}

  "evals in order": (a) ->
    i = 0
    v1 = L ($) -> $.return(++i)
    v2 = L ($) -> $.return(++i)
    Let("a",v1,"b",v2) () ->
      a.eql @a, 1
      a.eql @b, 2

  "raises error": (a) ->
    Let("a",1,"b",fail) (e) ->
      a.eql e, "error"

}