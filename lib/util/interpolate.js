"use strict";
var expr = require('property-expr')
  , strReg = /\$\{\s*(\w+)\s*\}/g;

var strInterpolate = module.exports = curry(function (str, obj){
  return str.replace(strReg, function(s, key){
    return expr.getter(key)(obj) || '';
  })
})

function curry(fn) {
  return function(a, b){
    if (arguments.length > 1)
      return fn.call(this, a, b)
    else
      return function (b){ return fn.call(this, a, b) }
  }
}