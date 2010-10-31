And = require("../lib/combinators").And
L = require("../lib/combinators").Lazy

sys = require("sys")
p = (o) ->
  sys.puts(sys.inspect(o))

fail = L ($) -> $.raise("error")
# t = L ($) -> $.return(true)
# f = L ($) -> $.return(false)

module.exports = {
  "return first falsey value": (a) ->
    And(1,null,0,1,2) (e,r) -> a.eql r, null
  "return first truthy value": (a) ->
    And(1,2,3) (e,r) -> a.eql r, 3
  "raises error": (a) ->
    And(1,fail) (e,r) -> a.eql e, "error"
  "does not raise error if short circuited": (a) ->
    And(false,fail) (e,r) ->
      a.eql r, false
      a.eql e, undefined
}