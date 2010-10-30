Do = require("../lib/combinators").Do
L = require("../lib/combinators").Lazy

sys = require("sys")
p = (o) ->
  sys.puts(sys.inspect(o))

fail = L ($) -> $.raise("error")

module.exports = {
  "evaluate each value in order": (a) ->
    i = 0
    v1 = v2 = v3 = null
    l1 = L ($) -> $.return(v1 = ++i)
    l2 = L ($) -> $.return(v2 = ++i)
    l3 = L ($) -> $.return(v3 = ++i)
    Do(l1,l2,l3)()
    a.eql v1, 1
    a.eql v2, 2
    a.eql v3, 3

  "fails if anything fails": (a) ->
    Do(fail,1) (e) -> a.eql e, "error"
    Do(1,fail) (e) -> a.eql e, "error"

  "does not evaluate anything after failure": (a) ->
    trap = null
    l = L ($) -> $.return(trap = true)
    Do(fail,l) (e) -> a.eql(e,"error")
    a.isNull trap

}