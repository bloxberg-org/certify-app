<template>
  <v-layout row justify-center>
    <v-btn class="mainaccent secondary--text" large @click.stop="verifydialog = true">
      Verify
    </v-btn>

    <v-dialog v-model="verifydialog" max-width="150vh">
       <v-card>
        <v-btn color="red" icon flat @click.native="resetModal">
          <v-icon>close</v-icon>
        </v-btn>
        <CertifyTransactionHistory/>
      </v-card> 
    </v-dialog>
  </v-layout>

</template>

<script>
import certifyResearchDataImport from '../../build/contracts/certifyResearchData.json'
var CryptoJS = require('crypto-js')
import axios from 'axios'
import CertifyTransactionHistory from './CertifyTransactionHistory'

export default {
  name: 'verify-modal',
  components: {
    CertifyTransactionHistory
  },
  data () {
    return {
      errorMsg: '',
      userTransaction: '',
      showinitial: true,
      uploadReady: true,
      showcard: false,
      verifydialog: false,
      verifylabel: 'File Name',
      btnMsg: 'Lookup Hash',
      divider: true,
      verifyfileName: '',
      verifyvalid: true,
      transactionvalid: false,
      verifymanualchecksum: '',
      fromFile: true,
      verifyhashchecksum: 'Please select your desired file',
      verifybuffer: '',
      certifyRules: [v => !!v || 'Please select a file'],
      ethAddress: '',
      transactionRules: [v => !!v || 'Please enter a transaction number'],
      verifychecksum: '',
      researchDataArray: '',
      verifiedDataArray: [],
      headers: [
        {
          text: 'Author',
          align: 'left',
          sortable: false,
          value: 'author'
        },
        { text: 'Timestamp', value: 'timestamp' },
        { text: 'Checksum', value: 'checksum' },
        { text: 'Research ID', value: 'researchID' }
      ],
      tempArray: [],
      timestamp: '',
      dataID: '',
      authorName: '',
      smartContractCheckSum: ''
    }
  },

  methods: {
    verifycaptureFile: function (event) {
      event = event.target.files[0]
      console.log(event)
      this.verifyfileName = event.name
      const file = event
      try {
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)
      } catch (err) {
        console.log(err)
      }
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

    convertToBuffer: function (reader) {
      try {
        let wordArray = CryptoJS.lib.WordArray.create(reader.result)
        let hash = CryptoJS.SHA256(wordArray).toString()
        this.verifychecksum = hash
        this.verifyhashchecksum = 'Hash: ' + hash
        const buffer = Buffer.from(reader.result)
        // //set this buffer -using es6 syntax
        this.verifybuffer = buffer
      } catch (err) {
        console.log(err)
      }
    },
    manualcheck: function (event) {
      this.verifychecksum = this.verifymanualchecksum
    },

    search: function () {
      if (this.$refs.form.validate()) {
        window.location.href =
          'https://blockexplorer.bloxberg.org/tx/' +
          this.userTransaction +
          '/internal_transactions'
      }
    },
    submit () {
      if (this.$refs.form.validate()) {
        if (this.$store.state.web3.networkId === null) {
          const verifyVariables = {
            verifychecksum: this.verifychecksum
          }
          axios
          .post('/verifyData', { verifyVariables })
          .then(res => {
            this.verifiedDataArray = res.data.dataArray
            console.log(this.verifiedDataArray + 'test')
            return this.verifiedDataArray
          })
          .then(verifiedDataArray => {
            if (this.verifiedDataArray !== null) {
              this.showcard = true
              this.showinitial = false
            }
            this.smartContractCheckSum = this.verifiedDataArray[0]
            this.authorName = this.verifiedDataArray[1]
            if (this.verifiedDataArray[1] == null) {
              this.authorName = 'None Provided'
            }
            this.dataID = this.verifiedDataArray[2]
            this.timestamp =
              this.timeConverter(this.verifiedDataArray[3])
          })
          .catch(err => {
            console.log(err)
          })
        } else {
          this.ethAddress = this.$store.state.web3.coinbase
          console.log('Current address ' + this.ethAddress)
          const Contract = require('truffle-contract')
          const certifyResearchDataContract = Contract(certifyResearchDataImport)
          certifyResearchDataContract.setProvider(
          this.$store.state.web3.instance().currentProvider
        )
          var certifyResearchDataContractInstance
          certifyResearchDataContract
          .deployed()
          .then(instance => {
            certifyResearchDataContractInstance = instance
            return certifyResearchDataContractInstance.getResearchDataIdentifiers.call()
          })
          .then(verify => {
            this.researchDataArray = verify
            for (var i = 0; i < this.researchDataArray.length; i++) {
              // Loop through length of smart contract struct
              let retrieved = certifyResearchDataContractInstance.retrieveResearchData(
                this.researchDataArray[i],
                { from: this.ethAddress }
              )
              this.tempArray = this.tempArray.concat(retrieved)
            }
            return this.tempArray
          })
          .then(retrieved => {
            Promise.all(retrieved)
              .then(data => {
                this.temparray = []
                console.log(data)

                for (var i = 0; i < data.length; i++) {
                  if (data[i][0] === this.verifychecksum) {
                    this.verifiedDataArray.push({
                      checksum: data[i][0],
                      author: data[i][1],
                      researchID: data[i][2],
                      timestamp: this.timeConverter(data[i][3])
                    })
                  }
                }
                if (this.verifiedDataArray !== null) {
                  this.showcard = true
                  this.showinitial = false
                }
                console.log(this.verifiedDataArray)

                this.smartContractCheckSum = this.verifiedDataArray[0]
                this.authorName = this.verifiedDataArray[1]
                if (this.authorName === null) {
                  this.authorName = 'None Provided'
                }
                this.dataID = this.verifiedDataArray[2]
                this.timestamp =
                  this.timeConverter(this.verifiedDataArray[3])
              })
              .catch(err => {
                console.log(err)
              })
          })
        } // else
      }
    },
    resetModal: function () {
      // this.$refs.form.resetValidation()
      this.uploadReady = false
      this.$nextTick(() => {
        this.uploadReady = true
      })
      this.verifydialog = false
      this.verifylabel = 'File Name'
      this.btnMsg = 'Lookup Hash'
      this.btncolor = ''
      this.divider = true
      this.verifyfileName = 'File Name'
      this.verifyvalid = true
      this.verifymanualchecksum = null
      this.verifyhashchecksum = 'Please select your desired file'
      this.verifybuffer = ''
      this.ethAddress = ''
      this.verifychecksum = ''
      this.researchDataArray = ''
      this.verifiedDataArray = []
      this.tempArray = []
      this.showcard = false
      this.showinitial = true
    }
  }
}
</script>

<style scoped>
.upload-btn {
  padding-left: 16px;
  padding-right: 16px;
}
.upload-btn input[type="file"] {
  position: absolute;
  height: 0.1px;
  width: 0.1px;
  overflow: hidden;
  opacity: 0;
  z-index: -1;
}
.upload-btn-hover {
  cursor: pointer !important;
}
#uploadLabel {
  cursor: pointer;
}
.transaction {
  margin-left: 25%;
}
.divider {
  margin-bottom: 3%;
}
#gobutton {
  margin-bottom: 5%;
}
.fa-file-import {
  padding-left: 5px;
}
</style>
