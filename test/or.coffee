Or = require("../lib/combinators").Or
L = require("../lib/combinators").Lazy

sys = require("sys")
p = (o) ->
  sys.puts(sys.inspect(o))

fail = L ($) -> $.raise("error")
# t = L ($) -> $.return(true)
# f = L ($) -> $.return(false)

module.exports = {
  "return first non-false value": (a) ->
    Or(undefined,null,0,1,2) (e,r) -> a.eql r, 1
}