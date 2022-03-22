<template>
  <v-container align-center>
    <v-layout justify-center align-center>
      <div class="text-xs-center">
        <div v-if="hasWeb3InjectedBrowser">
          <p class="font-weight-bold">Please make sure to login to Metamask using our node at https://core.bloxberg.org and chainID 8995 <br>and request Ether at our faucet before submitting a transaction.</p>
        </div>
        <v-btn @click="certify" :loading="loading" :disabled="loading" class="accent secondary--text animated pulse delay-1.5s" large round>
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
import axios from 'axios'
import web3 from 'web3'
export default {
  props: ['revert'],
  name: 'certify-certificate',
  data () {
    return {
      loader: null,
      loading: false,
      alert: false,
      API_URL: '',
      ethAddress: '',
      timestampString: '',
      authorName: '',
      finishTransaction: false,
      miningMsg: '',
      publicKey: '',
      metamaskMessage: ''
    }
  },
  mounted () {
    this.$forceUpdate()
  },
  watch: {
    revert (value) {
      if (value === true) {
        this.loading = false
        this.loader = null
        this.miningMsg = ''
        this.gasAmount = null
        this.finishTransaction = false
        this.authorName = ''
        this.timestampString = ''
        this.alert = false
        this.publicKey = ''
        this.metamaskMessage = ''
        this.usingMetaMask = ''
      }
    }
  },
  methods: {
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
    makeloader: function () {
      this.loading = true
    },
    isValidPublicKey: function (address) {
      return web3.utils.isAddress(address)
    },
    certify: async function () {
      // eslint-disable-next-line no-unused-vars
      this.loading = true
      this.miningMsg = 'Processing Transaction...'
      // If no MetaMask, compute server side
      try {
        const metadataVariables = {
          authorName: this.$store.state.user.authorName,
          researchTitle: this.$store.state.user.researchTitle,
          emailAddress: this.$store.state.user.emailAddress
        }
        const metadataString = JSON.stringify(metadataVariables)
        let crid = this.$store.state.user.checksum
        this.publicKey = this.$store.state.user.mintAddress
        if (this.publicKey === '') {
          this.publicKey = '0x9858eC18a269EE69ebfD7C38eb297996827DDa98'
          console.log(this.publicKey)
        } else {
          console.log('public key provided')
          console.log(this.publicKey)
          this.publicKey = this.$store.state.user.mintAddress
        }

        // Check if valid public key
        const isValid = this.isValidPublicKey(this.publicKey)
        if (isValid === false) {
          // eslint-disable-next-line no-throw-literal
          throw 'Invalid Public Key'
        }
        console.log(crid)
        this.certificateRequest = {
          'publicKey': this.publicKey,
          'crid': crid,
          'cridType': 'sha2-256',
          'enableIPFS': false,
          'metadataJson': metadataString
        }
        console.log(this.certificateRequest)
      } catch (err) {
        console.log(err)
      }
      console.log(process.env.CLIENT_ENV)
      console.log(process.env)
      var API_URL
      var headers
      if (process.env.CLIENT_ENV === 'development') {
        API_URL = 'http://localhost:7000/createBloxbergCertificate'
        headers = {'api_key': process.env.DEV_API_KEY}
      } else if (process.env.CLIENT_ENV === 'testing') {
        API_URL = 'https://qa.certify.bloxberg.org/createBloxbergCertificate'
        headers = {'api_key': process.env.QA_API_KEY}
      } else if (process.env.CLIENT_ENV === 'production') {
        API_URL = 'https://certify.bloxberg.org/createBloxbergCertificate'
        headers = {'api_key': process.env.PROD_API_KEY}
      }
      console.log(API_URL)
      axios
        .post(API_URL, this.certificateRequest, {headers})
        .then(res => {
          console.log(res)
          this.$store.state.user.dataURL = res.data
        })
        .then(() => {
          this.loading = false
          this.miningMsg = 'Transaction Confirmed! Select Finish to create your certificate.'
          this.$store.state.user.validatedTransaction = true
        })
        .catch(err => {
          this.loading = false
          console.log('Error sending certificate data', err)
          this.miningMsg = 'Sorry, something went wrong with confirming your transaction.'
        })
      // if Metamask exists in Browser
    }
  }
}
</script>

<style scoped>
.notification {
  margin-bottom: 500px;
}
</style>
