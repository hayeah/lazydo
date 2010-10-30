# we test LazyEval by using the Do combinator

Do = require("../lib/combinators").Do
L = require("../lib/combinators").Lazy

sys = require("sys")
p = (o) ->
  sys.puts(sys.inspect(o))

fail = L ($) -> $.raise("error")
random = L ($) -> $.return Math.random()

module.exports = {
  "evals an eager as it is": (a) ->
    Do(1) (e,r) -> a.eql r, 1

  "gives error": (a) ->
    Do(fail) (e,r) -> a.eql e, "error"

  "evals a lazy value by forcing it": (a) ->
    l = L ($) -> $.return(10)
    Do(l) (e,r) -> a.eql r, 10

  "a lazy value is evaled once and memoized": (a) ->
    v1 = v2 = null
    Do(random) (e,r) -> v1 = r
    Do(random) (e,r) -> v2 = r
    a.eql v1, v2

  "lazy values are recursively evaled": (a) ->
    v1 = L ($) -> $.return(1)
    v2 = L ($) -> $.return(v1)
    v3 = L ($) -> $.return(v2)
    Do(v3) (e,r) ->
      a.eql r, 1

  "callbacks wait until lazy value is ready": (a) ->
    $ = r1 = r2 = null
    l = L ($2) -> $ = $2
    Do(l) (e,r) -> r1 = r
    Do(l) (e,r) -> r2 = r
    $.return Math.random()
    a.eql r1, r2

}