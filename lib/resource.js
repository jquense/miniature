'use strict';
var Clank = require('clank')
  , Promise = require('bluebird')
  , _ = require('lodash')
  , schemaPath = require('./util/schema-path')
  , interpolate = require('./util/interpolate')

var Resource = module.exports = Clank.Object.extend({

  url: Clank.required,

  idField: Clank.required,

  prefix: 'models',

  // constructor: function Resource(){

  //   Clank.Object.call(this)
  // },

  _field: function (field){
    return schemaPath(field)(this)
  },

  getUrl: function(obj){
    var rTrailingSlash = /\/$/
      , url = this.url;

    if( typeof this.url === 'string')
      url = interpolate(this.url)

    return url(obj || {}).replace(rTrailingSlash, '')
  },

  // idFor: function(obj){
  //   return obj[this.id]
  // },

  isNew: function(obj){
    return obj[this.id] === this._field([this.id]).default()
  },

  createRecord: function(spec) {
    return this.schema.cast(spec)
  },

  validatePath: function(path, obj){
    var field = this._field(path)
    return !field || field.isValid(obj)
  },

  save: function(record, options){
    var data = {};

    if( _.isArray(record) ) {
      data[this.prefix] = record
    }
    else data = record

    return this.sync('POST', data, options || {})
  },

  saveMany: function(records, options){
    var self = this
      , created = []
      , updated = []
      , batch = options.batch !== false;

    if(batch) {
      _.each(records, function(r){
        r = this.schema.cast(r)
        this.isNew(r) ? created.push(r) : updated.push(r)
      }, this)

      return Promise.all([
        this.sync('POST', wrap(this.prefix, created), options),
        this.sync('PUT', wrap(this.prefix, updated), options ),
      ])
    }

    return Promise.map(records, function(record){
      return self.sync(self.isNew(record)? 'POST' : 'PUT', record, options )
    })
  },

  sync: function(action, data, options){

  }

})


Resource.setCompositionStrategy({

  schema: new Clank.Descriptor(function(key, values) {
    return _.reduce(values, function(current, next, idx){
      if( !next.__isYupSchema__ || next.type !== 'object' )
        throw new TypeError('the Schema property must be a Yup Object schema')

      return next ? current.shape(next) : current
    })
  })
})


function wrap(prefix, val){
  var obj = {}
  obj[prefix] = val
  return obj
}

// var variable = /\{\{\s*(\w+)\s*\}\}/g
// var idField = yup.number().min(1).integer()
//
// var UsersResource = Resource.extend({
//
//   url: '/api/user/${id}',
//
//   idField: 'userID',
//
//   schema: yup.object()
//    .camelCase()
//    .shape({
//      userID:   idField,
//      userName: yup.string().required().matches(/^ijm\\\w+$/i).trim(),
//      name:     yup.string().required().trim(),
//      email:    yup.email(),
//      roles:    yup.array().of(idField),
//    })
// })

// var userResource = new UsersResource()
// UsersResource.All() // => [{}, {},{}]
// UsersResource.save(obj) //
// var user = usersResource.create({ blah: blah})