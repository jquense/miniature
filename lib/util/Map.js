'use strict';
var _ = require('lodash')

module.exports = Map

function Map(obj){
  this._items = _.extend({}, obj)
}

Map.prototype.has = function(key){
  return _.has(this._items, key)
}

Map.prototype.remove = function(key){
  if( this.has(key)) this._items = this.omit(key)
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

Map.prototype.ad = function(key, val){
  if( this.has(key))  throw new TypeError('key already exists in the map')
  this._items[key] = val
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
