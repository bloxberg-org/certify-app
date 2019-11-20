<template>
  <v-container align-center>
    <v-layout justify-center align-center>
      <div class="text-xs-center">
        <div v-if="hasWeb3InjectedBrowser">
          <p class="font-weight-bold">Please make sure to login to Metamask using our node at https://bloxberg.org/eth/ <br>and request Ether at our faucet before submitting a transaction.</p>
        </div>
        <v-btn v-on:click="certify" :loading="loading" :disabled="loading" class="accent secondary--text animated pulse delay-1.5s" @click.native="loader = 'loading'" large round>
          Certify on the Blockchain
        </v-btn>
        <h3>{{miningMsg}}</h3>
        <br>
        <div v-if="finishTransaction === 'true'" class="text-xs-center">
          <p class="subheading">Select Finish to create your bloxberg certificate!</p>
        </div>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import certBackground from '../assets/certbackground3.jpg'
const certifyResearchDataImport = require('../assets/createResearchDataABI.json')
import axios from 'axios'

export default {
  props: ['revert'],
  name: 'certify-certificate',
  data () {
    return {
      loader: null,
      gasAmount: null,
      loading: false,
      alert: false,
      ethAddress: '',
      timestampString: '',
      checksum: '',
      authorName: '',
      finishTransaction: false,
      miningMsg: '',
      web3Browser: this.$store.state.web3.web3Browser,
      hasWeb3InjectedBrowser: this.$store.state.user.hasWeb3InjectedBrowser,
      certBackground: certBackground,
      metamaskMessage: '',
      usingMetaMask: this.$store.state.user.hasWeb3InjectedBrowser
    }
  },
  mounted () {
    this.$forceUpdate()
  },
  watch: {
    revert (value) {
      if (value === true) {
        this.loading = false
        this.miningMsg = ''
        this.gasAmount = null
        this.finishTransaction = false
        this.authorName = ''
        this.timestampString = ''
        this.alert = false
        this.metamaskMessage = ''
        this.usingMetaMask = ''
      }
    }
  },
  methods: {
    toDataUrl: async (file, callback) => {
      var xhr = new XMLHttpRequest()
      xhr.responseType = 'blob'
      xhr.onload = function () {
        var reader = new FileReader()
        reader.onloadend = function () {
          callback(reader.result)
        }
        reader.readAsDataURL(xhr.response)
      }
      xhr.open('GET', file)
      xhr.send()
    },

    timeConverter: function (unixTimestamp) {
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
    },
    estimateGas: async function () {
      const certifyResearchDataContract = new web3.eth.Contract(certifyResearchDataImport, '0xe5a9654c7e190701016ebf18206020bf16d8beab')
      const timestamp = new Date().getTime() / 1000 // Define timestamp on the client side before posting to SC
      this.timestampString = timestamp.toString()
      this.$store.state.user.timestampString = this.timeConverter(
              this.timestampString
            )
      this.checksum = this.$store.state.user.checksum
      this.authorName = this.$store.state.user.authorName
      console.log(this.checksum)
      const gasAmount = await certifyResearchDataContract.methods.createData(this.checksum, true, this.authorName, this.timestampString).estimateGas({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'})
      this.gasAmount = gasAmount
      return gasAmount
    },
    certify: async function () {
      var self = this
      this.loading = true
      this.miningMsg = 'Processing Transaction...'
      // If no MetaMask, compute server side
      if (this.$store.state.web3.networkId === null) {
        const timestamp = new Date().getTime() / 1000 // Define timestamp on the client side before posting to SC
        this.timestampString = timestamp.toString()
        this.$store.state.user.timestampString = this.timeConverter(
          this.timestampString
        )
        const certifyVariables = {
          checksum: this.$store.state.user.checksum,
          authorName: this.$store.state.user.authorName,
          timestampString: this.timestampString
        }
        // Send to server to perform transaction
        axios
          .post('/certifyData', { certifyVariables })
          .then(res => {
            this.$store.state.user.transactionReceipt = res.data.txReceipt
          })
          .then(() => {
            this.loading = false
            this.miningMsg = 'Transaction Confirmed! Select Finish to create your certificate.'
            this.$store.state.user.validatedTransaction = true
            // Convert image to Binary data and store to state
            try {
              this.toDataUrl(this.certBackground, dataUrl => {
                this.$store.state.user.dataURL = dataUrl
                return
              })
            } catch (err) {
              console.log(err)
            }
          })
          .catch(err => {
            console.log('Error sending certificate data', err)
            this.miningMsg = 'Sorry, something went wrong with confirming your transaction.'
          })
        // if Metamask exists in Browser
      } else {
        await this.estimateGas()
        console.log('Using Metamask Account')
        this.ethAddress = this.$store.state.web3.coinbase
        console.log('Current address ' + this.ethAddress)
        const certifyResearchDataContract = new web3.eth.Contract(certifyResearchDataImport, '0xe5a9654c7e190701016ebf18206020bf16d8beab')
        const timestamp = new Date().getTime() / 1000 // Define timestamp on the client side before posting to SC
        this.timestampString = timestamp.toString()
        this.$store.state.user.timestampString = this.timeConverter(
               this.timestampString
             )
        this.checksum = this.$store.state.user.checksum
        this.authorName = this.$store.state.user.authorName
        await certifyResearchDataContract.methods.createData(self.checksum, true, self.authorName, self.timestampString).send({
          // from: self.ethAddress, gas: self.gasAmount, gasPrice: 9000000000})
          from: self.ethAddress, gas: 1000000, gasPrice: 50000000000})
          .then((receipt) => {
            this.$store.state.user.transactionReceipt = receipt
          })
          .then(finished => {
            this.loading = false
            this.miningMsg = 'Transaction Confirmed! Select Finish to create your certificate.'
            this.$store.state.user.validatedTransaction = true
            // Convert image to Binary data and store to state
            try {
              this.toDataUrl(this.certBackground, dataUrl => {
                this.$store.state.user.dataURL = dataUrl
              })
            } catch (err) {
              console.log(err)
            }
          })
          .catch(error => {
            this.loading = false
            this.transactionError = true
            this.miningMsg = "We couldn't complete your transaction. Have you logged into Metamask?"
            console.log(error)
          })
      }
    }
  }
}
</script>

<style scoped>
.notification {
  margin-bottom: 500px;
}
</style>
