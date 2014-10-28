"use strict";
var extend = require('xtend')
  , ajax = require('./ajax');

module.exports = function sync(method, data, options) {
    var params = {
            type: method,
            dataType: 'json'
        };

    options || (options = {})

    if (!options.url)
        params.url = this.url(data) || urlError()

    if (options.data == null && this && method !== 'GET' ) {
      params.contentType = 'application/json'
      params.data = JSON.stringify(data)
    }

    return ajax(extend(params, options))
};


function urlError() {
    throw new Error('A "url" property or function must be specified');
};
