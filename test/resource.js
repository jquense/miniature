'use strict';
/* global describe, it */
var chai  = require('chai')
  , sinon = require("sinon")
  , sinonChai = require("sinon-chai")
  , yup = require('yup')
  , sp = require('../lib/util/schema-path')
  , Resource = require('../lib/resource');

chai.use(sinonChai);
chai.should();


describe('Boolean types', function(){

  it('should find fields correctly', function(){
    var idField = yup.number().min(1).integer()
    var schema = yup.object()
          .camelcase()
          .shape({
            userID:   idField,
            userName: yup.string().required().matches(/^ijm\\\w+$/i).trim(),
            name:     yup.string().required().trim(),
            email:    yup.string().email(),
            roles:    yup.array().of(
                yup.object({ id: idField })
              ),
          })

    sp('userID',      schema).should.equal(idField)
    sp('roles[].id',  schema).should.equal(idField)
    sp('roles[1].id', schema).should.equal(idField)

    console.log(sp('roles[].id', schema))
  })

  it('should CAST correctly', function(){
    var idField = yup.number().min(1).integer()
    var UsersResource = Resource.extend({

      url: '/api/user/${id}',

      idField: 'userID',

      schema: yup.object()
       .camelcase()
       .shape({
         userID:   idField,
         userName: yup.string().required().matches(/^ijm\\\w+$/i).trim(),
         name:     yup.string().required().trim(),
         email:    yup.string().email(),
         roles:    yup.array().of(idField),
       })
    })

    var user = new UsersResource()


  })

})