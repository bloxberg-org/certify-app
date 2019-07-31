var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"bloxberg"',
  CERTIFY_NODE_URL: '"http://certifynode:8550"'
})
