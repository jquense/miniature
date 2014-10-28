'use strict';
module.exports = Map

function Map(obj){
  var vals = this._vals = []
    , keys = this._keys   = []

  _.each(obj, function(val, key){
    val.push(val)
    keys.push(key)
  })
}

Map.prototype.has = function(key){
  return this._keys.indexOf(key) !== -1
}

Map.prototype.remove = function(key){
  var idx = this._keys.indexOf(key)

  if( idx !== -1) {
    this._keys.splice(idx, 1)
    this._vals.splice(idx, 1)
  }
}

Map.prototype.get = function(key){
  var idx = this._keys.indexOf(key)
  if( idx === -1)
    throw new RangeError('key: `' + key + '`does not exist in the map')

  return this._vals[idx]
}

Map.prototype.add = function(key, val){
  var self = this;

  if(arguments.length === 2)
    return add(val, key)

  _.each(key, add)

  function add(val, key){
    self._vals.push(val)
    self._keys.push(key)
  }
}

Map.prototype.keys = function(){
  return [].slice.call(this._keys)
}

Map.prototype.values = function(){
  return [].slice.call(this._vals)
}

Map.prototype.size = function(){
  return this._keys.length
}

Map.prototype.clear = function(){
  this._vals.length = this._keys.length = 0
}

Map.prototype.forEach = function(callback, thisArg){
  var self = this;

  _.each(this._keys, function(key, idx){
    callback.call(thisArg, self._vals[idx], key, self)
  })
}
