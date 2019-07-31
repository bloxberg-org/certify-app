var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CERTIFY_NODE_URL: '"http://localhost:8550"'
})
