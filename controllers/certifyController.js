const Web3 = require('web3')
const contract = require('truffle-contract')
const fs = require('fs')
const certifyResearchDataImport = require('../src/assets/createResearchDataABI.json')

const fileContents = fs.readFileSync(
  './build/contracts/certifyResearchData.json',
  'utf8'
)

module.exports = {
  certifyData: {
    post: async (req, res, next) => {
      const checksum = req.body.metadataVariables.checksum
      const authorName = req.body.metadataVariables.authorName
      const timestampString = req.body.metadataVariables.timestampString

      console.log(checksum)
      console.log(authorName)
      console.log(timestampString)

      if (typeof checksum !== 'string') {
        const err = new Error('Checksum was not a string')
        return res.status(400).send({ msg: err.message })
      } else if (typeof authorName !== 'string') {
        const err = new Error('author name was not a string')
        return res.status(400).send({ msg: err.message })
      } else if (typeof timestampString !== 'string') {
        const err = new Error('timestamp was not a string')
        return res.status(400).send({ msg: err.message })
      }

      const certifyResearchDataArtifacts = JSON.parse(fileContents)
      const certifyResearchData = contract(certifyResearchDataArtifacts)

      var accounts
      var account

      const web3 = new Web3(
        new Web3.providers.HttpProvider(process.env.CERTIFY_NODE_URL)
      )
      certifyResearchData.setProvider(web3.currentProvider)
      if (typeof certifyResearchData.currentProvider.sendAsync !== 'function') {
        certifyResearchData.currentProvider.sendAsync = function () {
          return certifyResearchData.currentProvider.send.apply(
            certifyResearchData.currentProvider,
            arguments
          )
        }
      }
      const certifyResearchDataContract = new web3.eth.Contract(certifyResearchDataImport, '0xe5a9654c7e190701016ebf18206020bf16d8beab')
      web3.eth.getAccounts(function (err, accs) {
        if (err != null) {
          console.error('There was an error fetching your accounts.')
          const err = new Error('There was an error fetching your accounts')
          return res.status(400).send({ msg: err.message })
        }
        if (accs.length === 0) {
          console.error(
            "Couldn't get any accounts! Make sure your Ethereum client is configured correctly."
          )
          return
        }
        console.log(accs[0])
        account = accs[0]
        certifyResearchDataContract.methods.createData(checksum, true, authorName, timestampString).send({
          from: account, gas: 1000000, gasPrice: 50000000000})
          .then((receipt) => {
            console.log(receipt)
            return res.status(200).send({ msg: 'Transaction succeeded', txReceipt: receipt })
          })
          .catch((error) => {
            console.log(error)
            return res.status(400).send({ msg: err.msg })
          })
      })
    }
  },
  registerWeb3: {
    post: async (req, res, next) => {
      var finalWeb3 = async function getWeb3 (web3Instance) {
        try {
          // let getWeb3 = new Promise(function(resolve, reject) {
          var bip39 = require('bip39')
          var hdkey = require('ethereumjs-wallet/hdkey')

          // const WalletProvider = require("truffle-hdwallet-provider-privkey");
          var ProviderEngine = require('web3-provider-engine')
          var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js')
          const walletFactory = require('ethereumjs-wallet')
          var Web3Subprovider = require('web3-provider-engine/subproviders/web3.js')
          const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')

          var privateKey = process.env.PRIVATE_KEY
          var privateKeyBuffer = new Buffer(privateKey, 'hex')
          var myWallet = walletFactory.fromPrivateKey(privateKeyBuffer)
          var providerUrl = process.env.CERTIFY_NODE_URL
          var engine = new ProviderEngine()
          // filters
          engine.addProvider(new FilterSubprovider())

          engine.addProvider(new WalletSubprovider(myWallet, {}))
          engine.addProvider(
            new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl))
          )
          engine.start() // Required by the provider engine.

          var web3 = new Web3(engine)

          var serializedWeb3 = CircularJSON.stringify(web3)

          return serializedWeb3
        } catch (err) {
          console.log('web3 instantiation failed', err)
        }
        //   resolve({ hasInjectedWeb3: true, serializedWeb3 });
        // }).then(result => {
        return res
          .status(200)
          .send({ msg: 'Web3 Injected', web3Injection: finalWeb3 })
        // });
      }
    }
  },
  verifyData: {
    post: async (req, res, next) => {
      const verifychecksum = req.body.verifyVariables.verifychecksum
      const certifyResearchDataArtifacts = JSON.parse(fileContents)
      const certifyResearchData = contract(certifyResearchDataArtifacts)

      var accounts
      var account

      const web3 = new Web3(
        new Web3.providers.HttpProvider(process.env.CERTIFY_NODE_URL)
      )

      certifyResearchData.setProvider(web3.currentProvider)
      if (typeof certifyResearchData.currentProvider.sendAsync !== 'function') {
        certifyResearchData.currentProvider.sendAsync = function () {
          return certifyResearchData.currentProvider.send.apply(
            certifyResearchData.currentProvider,
            arguments
          )
        }
      }
      // Timeconverter server side
      function timeConverter (UNIX_timestamp) {
        var a = new Date(UNIX_timestamp * 1000)
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
          date +
          ' ' +
          month +
          ' ' +
          year +
          ' ' +
          hour +
          ':' +
          min.substr(-2) +
          ':' +
          sec.substr(-2) +
          ' (UTC)'
        return time
      }

      web3.eth.getAccounts(function (err, accs) {
        if (err != null) {
          console.error('There was an error fetching your accounts.')
          return
        }
        if (accs.length == 0) {
          console.error(
            "Couldn't get any accounts! Make sure your Ethereum client is configured correctly."
          )
          return
        }
        account = accs[0]
        // account = accounts[1]
        console.log(account)

        var tempArray = []
        var verifiedDataArray = []

        // web3.eth.personal.unlockAccount(account, "node0pwd", 100);

        ipfs = certifyResearchData.deployed().then(function (instance) {
          return instance.getResearchDataIdentifiers
            .call()
            .then(verify => {
              for (var i = 0; i < verify.length; i++) {
                let retrieved = instance.retrieveResearchData(verify[i], {
                  from: account
                })
                tempArray = tempArray.concat(retrieved)
              }
              return tempArray
            })
            .then(retrieved => {
              Promise.all(retrieved)
                .then(data => {
                  temparray = []
                  for (var i = 0; i < data.length; i++) {
                    if (data[i][0] == verifychecksum) {
                      verifiedDataArray.push({
                        checksum: data[i][0],
                        author: data[i][1],
                        researchID: data[i][2],
                        timestamp: timeConverter(data[i][3])
                      })
                    }
                  }
                  console.log(verifiedDataArray)
                  return verifiedDataArray
                })
                .then(dataArray => {
                  return res.status(200).send({
                    msg: 'Transaction succeeded',
                    dataArray: dataArray
                  })
                })
            })
            .catch(function (err) {
              return res.status(400).send({ msg: err.msg })
            })
        })
      })
    }
  }
}
