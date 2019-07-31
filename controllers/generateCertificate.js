const fs = require('fs')
const certifyResearchDataImport = require('../src/assets/createResearchDataABI.json')
var QRCode = require('qrcode')
const abiDecoder = require('abi-decoder')
const axios = require('axios')
const pngToJpeg = require('png-to-jpeg')
var path = require('path')

module.exports = {
  generateCertificate: {
    post: async (req, res, next) => {
      console.log(req.body.certificateVariables.transactionHash)
      const transactionHash = req.body.certificateVariables.transactionHash
      // const transactionHash = req.body
      let certBackground = fs.readFileSync('./src/assets/certbackground3.jpg', {encoding: 'base64'})

      // Query blockchain for parameters
      const contractAddress = '0xe5a9654c7e190701016ebf18206020bf16d8beab'

      async function getTransactionParams (transaction, certifyResearchDataImport) {
        abiDecoder.addABI(certifyResearchDataImport)
        const response = await axios.get('https://blockexplorer.bloxberg.org//api?module=transaction&action=gettxinfo&txhash=' + transaction)
        const decodedTransaction = await abiDecoder.decodeMethod(response['data']['result']['input'])
        const blockNumber = response['data']['result']['blockNumber']
        Promise.resolve(decodedTransaction)
        return {decodedTransaction: decodedTransaction, blockNumber: blockNumber}
      }

      const generateQR = async transactionHash => {
        try {
          const QRcode = await QRCode.toDataURL(transactionHash)
          return Promise.resolve(QRcode)
        } catch (err) {
          console.error(err)
        }
      }

      let transactionHashUrl = 'https://blockexplorer.bloxberg.org/tx/' + transactionHash + '/internal_transactions'

      let qrcode = await generateQR(transactionHashUrl)
      const buffer = new Buffer.from(qrcode.split(/,\s*/)[1], 'base64')
      qrcode = await pngToJpeg({ quality: 90 })(buffer)
        .then(output => Promise.resolve(output))
      const decodedTransaction = await getTransactionParams(transactionHash, certifyResearchDataImport)
      const checksum = decodedTransaction['decodedTransaction']['params'][0]['value']
      let authorName = decodedTransaction['decodedTransaction']['params'][2]['value']
      let timestampInitial = decodedTransaction['decodedTransaction']['params'][3]['value']

      if (authorName !== '') {
      } else {
        authorName = 'Anonymous'
      }

      function timeConverter (unixTimestamp) {
        var a = new Date(unixTimestamp * 1000)
        var months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ]
        var year = a.getFullYear()
        var month = months[a.getMonth()]
        var date = a.getDate()
        var hour = a.getUTCHours()
        var min = '0' + a.getUTCMinutes()
        var sec = '0' + a.getUTCSeconds()
        var time =
          date + ' ' + month + ' ' + year + ' ' + hour + ':' + min.substr(-2) + ':' + sec.substr(-2) + ' (UTC)'
        return time
      }

      timestampInitial = timeConverter(timestampInitial)
      var smartAddress = 'Contract Address: ' + contractAddress
      var blockNumber = 'Block Number: ' + decodedTransaction['blockNumber']
      timeStamp = 'Time transaction submitted: ' + timestampInitial
      let dataHash = checksum
      const title = 'bloxberg Data Certificate'
      var certBackgroundURL = 'data:image/jpeg;base64,' + certBackground

      global.window = { document: { createElementNS: () => { return {} } } }
      global.navigator = {}
      global.btoa = () => { }
      global.atob = require('atob')
      const JsPDF = require('jspdf/dist/jspdf.node.min')
      var doc = new JsPDF('landscape', 'mm', 'a4')
      doc.addImage(certBackgroundURL, 'JPEG', 0, 0, 297, 210)
      doc.addImage(qrcode, 'JPEG', 135, 150, 30, 30)
      doc.setFont('times')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(40)
      doc.text(155, 30, title, null, null, 'center')

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(12)
      doc.setFontType('normal')
      doc.text(
          150,
          90,
          'This certificate verifies that',
          null,
          null,
          'center'
        )

      doc.setFontType('bold')
      doc.text(150, 90, '\n\n' + authorName, null, null, 'center')

      doc.setFontType('normal')
      doc.text(
          150,
          90,
          '\n\n\n\nuploaded a data hash that proves authenticity of the corresponding data matching the hash.',
          null,
          null,
          'center'
        )

      doc.setFontType('normal')

      doc.setFontSize(12)
      doc.text(
          155,
          130,
          'This certificate was authenticated in the following transaction ID on the bloxberg blockchain \n\n',
          null,
          null,
          'center'
        )

      doc.setFontType('bold')
      doc.text(155, 130, '\n\n' + transactionHash, null, null, 'center')

      doc.setFontType('normal')

      doc.setFontSize(8)
      doc.text(60, 190, blockNumber + '\n\n' + timeStamp)

      doc.setFontSize(8)
      doc.text(
          140,
          190,
          'SHA-256 Hash of uploaded data: ' + dataHash + '\n\n' + smartAddress
        )
      var data = doc.output()
      fs.writeFileSync('./src/assets/bloxbergDataCertificate.pdf', data, 'ascii')
      // var filePath = './src/assets/bloxbergDataCertificate.pdf'

      res.sendFile('./src/assets/bloxbergDataCertificate.pdf', {root: './'})
    }
  }
}
