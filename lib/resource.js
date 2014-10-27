'use strict';
var Clank = require('clank')
  , Map   = require('./util/Map')
  , Promise = require('bluebird')
  , _ = require('./util/_')
  , cobble = require('cobble')
  , schemaPath = require('./util/schema-path')
  , interpolate = require('./util/interpolate')

var rSlashes = /^\/+|\/+$/g

function getUrl(url){
  return function(context){
    context = _.isArray(context) ? {} : context
    return '/' + url(context || {}).replace(rSlashes, '')
  }
}

var Resource = module.exports = Clank.Object.extend({

  url:     cobble.required,

  idField: cobble.required,

  prefix: 'models',

  constructor: function(){
    var url;

    Clank.Object.call(this);
    this._records = new Map()

    url = this.url

    Object.defineProperty(this, 'url', {
      set: function(u){ url = typeof u === 'string' ? interpolate(u) : u },
      get: function(){ return getUrl(url) },
    })

    this.url = url
  },

  _field: function (field){
    return schemaPath(field, this.schema)
  },

  isNew: function(obj){
    return obj[this.idField] === this._field(this.idField).default()
  },

  get: function(id){
    var self = this
      , idField = this.idField;

    if ( this._records.has(id) )
      return Promise.resolve(this._records.get(id))

    return this.sync('GET', wrap(idField, id), {})
      .then(this._push.bind(this));
  },

  all: function(options){
    var self = this
      , id = this.idField
      , records = this._records.values();

    if ( records && records.length )
      return Promise.resolve(records)

    return this.sync('GET', records, {})
        .then(function(data){
          return self._push(data, true)
        });
  },

  createRecord: function(spec) {
    return this.schema.cast(spec)
  },

  validatePath: function(path, obj){
    var field = this._field(path)
    return !field || field.isValid(obj)
  },

  isValid: function(r, options){
    return this.schema.isValid(r, options)
  },

  save: function(record, options){
    record = this.schema.cast(record)

    if(!this.schema.isValid(record, { convert: false }))
      throw new Error

    return this.sync(
        this.isNew(record) ? 'POST' : 'PUT'
      , record, options || {})
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

  _push: function(data, batch){
    var self = this;

    data = self._parse(data, batch)

    if(_.isArray(data))
      return _.map(data, push)

    return push(data)

    function push(data){
      data = self.createRecord(data)
      self._records.add(data[self.idField], data)
      return data
    }
  },

  _parse: function(data, batch){
    return batch
      ? _.isArray(data)
        ? data
        : data[this.prefix]
      : data
  },

  sync: cobble.required

})


Resource.setCompositionStrategy({

  schema: new cobble.Descriptor(function(key, values) {
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