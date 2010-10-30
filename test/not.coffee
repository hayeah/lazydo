Not = require("../lib/combinators").Not
L = require("../lib/combinators").Lazy

sys = require("sys")
p = (o) ->
  sys.puts(sys.inspect(o))

fail = L ($) -> $.raise("error")
t = L ($) -> $.return(true)
f = L ($) -> $.return(false)

module.exports = {
  "negate return value": (a) ->
    Not(t) (e,r) -> a.eql r, false
    Not(f) (e,r) -> a.eql r, true
}