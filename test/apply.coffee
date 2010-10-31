Apply = require("../lib/combinators").Apply
Call = require("../lib/combinators").Call
L = require("../lib/combinators").Lazy

sys = require("sys")
p = (o) -> sys.puts(sys.inspect(o))

fail = L ($) -> $.raise("error")

fn = L ($) -> $.return((a) -> a)

module.exports = {
  "apply function with object as context": (a) ->
    o = {}
    l = Apply o, ((a,b) -> @a = a; @b = b; this), [1, 2]
    l (e,r) ->
      a.eql r.a, 1
      a.eql r.b, 2

  "apply the first lazy value as function": (a) ->
    l = Apply {}, fn, [1]
    l (e,r) -> a.eql r, 1

  "forces the value the application returned": (a) ->
    v = L ($) -> $.return(10)
    l = Apply {}, (() -> v), []
    l (e,r) -> a.eql r, 10

  "if fn is a string, assumes it names the property of the context object as function": (a) ->
    o = {}
    o.a = 10
    o.fn = () -> @a
    l = Apply o, "fn", []
    l (e,r) -> a.eql r, 10

  "call function with variable length arguments": (a) ->
    l = Call {}, ((args...) -> args), 1, 2, 3
    l (e,r) -> a.eql r, [1,2,3]
}