'use strict';
var _ = require('./_')

module.exports = Map

function Map(obj){
  this._items = _.extend(Object.create(null), obj)
}

Map.prototype.has = function(key){
  return _.has(this._items, key)
}

Map.prototype.remove = function(key){
  if( this.has(key)) this._items = this.omit(key)
}

Map.prototype.get = function(key){
  if( !this.has(key))
    throw new RangeError('key: `' + key + '`does not exist in the map')

  return this._items[key]
}

Map.prototype.add = function(key, val){
  var self = this;

  if(arguments.length === 2)
    return add(val, key)

  _.each(key, add)

  function add(val, key){
    if( self.has(key)) throw new TypeError('key: `' + key + '` already exists in the map')
    self._items[key] = val
  }
}

_.each(['each', 'map', 'filter', 'reduce', 'pick', 'omit', 'values', 'keys']
  , function(method){
      Map.prototype[method] = function(){
        var l = arguments.length
          , args = new Array(l + 1);

        args[0] = this._items
        for(var i = 0; i< l; ++i)
          args[i + 1] = arguments[i]

        return _[method].apply(_, args)
      }
    })
