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
  "return last falsey value": (a) ->
    Or(undefined,null) (e,r) -> a.eql r, null
  "raises error": (a) ->
    Or(null,false,fail) (e,r) -> a.eql e, "error"
    Or(null,fail,false) (e,r) -> a.eql e, "error"
  "does not raise error if short circuited": (a) ->
    Or(1,fail) (e,r) ->
      a.eql e, undefined
      a.eql r, 1
}