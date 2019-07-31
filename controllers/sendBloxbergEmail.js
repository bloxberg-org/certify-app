const nodemailer = require('nodemailer')

module.exports = {
  sendBloxbergEmail: {
    post: async (req, res, next) => {
      let transporter = nodemailer.createTransport({
        host: 'mx03.mucam.mpg.de',
        port: 25,
        secure: false
      })
      const emailName = req.body.emailVariables.emailName
      const emailAddress = req.body.emailVariables.emailAddress
      const emailMessage = req.body.emailVariables.emailMessage
      try {
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"bloxberg Consortium" <info@bloxberg.org>', // sender address
          // from: '"James Lawton" <lawton@mpdl.mpg.de>', // sender address
          to: 'info@bloxberg.org', // list of receivers
          subject: 'New Vote', // Subject line
          html: emailMessage + '</br></br>' + ' Name: ' + emailName + '</br></br>' + ' My email address is: ' + emailAddress // plain text body
        })
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
        return res.status(200).send({ msg: 'Email Successfully Sent' })
      } catch (err) {
        console.log(err)
        return res.status(400).send({ msg: 'Email Failure' })
      }
    }
  }
}
