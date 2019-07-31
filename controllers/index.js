const certifyController = require('./certifyController')
const generateCertificate = require('./generateCertificate')
const sendBloxbergEmail = require('./sendBloxbergEmail')

module.exports = {
  certifyController: certifyController,
  generateCertificate: generateCertificate,
  sendBloxbergEmail: sendBloxbergEmail
}
