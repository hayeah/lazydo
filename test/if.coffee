If = require("../lib/combinators").If
L = require("../lib/combinators").Lazy

sys = require("sys")

p = (o) ->
  sys.puts(sys.inspect(o))


fail = L ($) -> $.raise("error")

module.exports = {
  "true branch": (a) ->
    If(true,1,2) (e,r) -> a.eql r, 1

  "false branch": (a) ->
    If(false,1,2) (e,r) -> a.eql r, 2

  "raises error if any of the executing branches fails": (a) ->
    If(fail,1,2) (e,r) -> a.eql e, "error"
    If(true,fail,2) (e,r) -> a.eql e, "error"
    If(false,1,fail) (e,r) -> a.eql e, "error"

  "does not raise error if the branch is non-executing": (a) ->
    If(true,1,fail) (e,r) -> a.eql r, 1
    If(false,fail,2) (e,r) -> a.eql r, 2
}
