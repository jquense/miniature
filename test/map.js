'use strict';
/* global describe, it */
var chai  = require('chai')
  , sinon = require("sinon")
  , map   = require('../lib/util/Map')
  , sinonChai = require("sinon-chai");

chai.use(sinonChai);
chai.should();

describe('Map', function(){

  it('should ADD/GET/REMOVE items', function(){
    var m = new map()
      , key = { key: true }

    m.add(0, 'hello')
    m.add(key, 'hello')

    m.size().should.equal(2)
    m._keys.length.should.equal(2)
    m._vals.length.should.equal(2)

    m.get(0).should.equal('hello')
    m.remove(0)
    m.size().should.equal(1)
    m._keys.length.should.equal(1)
    m._vals.length.should.equal(1)

    m.remove(key)
    m.size().should.equal(0)
    m._keys.length.should.equal(0)
    m._vals.length.should.equal(0)
  })

  it('should get VALUES', function(){
    var m = new map()
      , key = { key: true }

    m.add(0, 'hello')
    m.add(key, 'hello')
    m.values().should.eql(['hello','hello'])

    var values = m.keys()
    values.length = 0
    m._vals.length.should.equal(2)
  })

  it('should get KEYS', function(){
    var m = new map()
      , key = { key: true }

    m.add(0, 'hello')
    m.add(key, 'hello')
    m.keys().should.eql([0, key])
    var keys = m.keys()
    keys.length = 0
    m._keys.length.should.equal(2)
  })
})