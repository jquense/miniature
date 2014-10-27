"use strict";
var _ = require('lodash')
  , ajax = require('./ajax');

module.exports = function sync(method, data, options) {
    var params = {
            type: method,
            dataType: 'json'
        };

    options || (options = {})

    if (!options.url)
        params.url = this.url(model) || urlError()

    if (options.data == null && this && method !== 'GET' ) {
      params.contentType = 'application/json'
      params.data = JSON.stringify(data)
    }

    return ajax(_.extend(params, options))
};


function urlError() {
    throw new Error('A "url" property or function must be specified');
};
