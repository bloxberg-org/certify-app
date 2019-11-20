const certifyController = require('./certifyController')
const generateCertificate = require('./generateCertificate')
const sendBloxbergEmail = require('./sendBloxbergEmail')
const healthcheck = require('./healthcheck')

module.exports = {
  certifyController: certifyController,
  generateCertificate: generateCertificate,
  sendBloxbergEmail: sendBloxbergEmail,
  healthcheck: healthcheck
}
