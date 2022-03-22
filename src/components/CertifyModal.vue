<template>
  <v-layout row justify-center>
    <v-btn class="mainaccent secondary--text" large @click.stop="dialog = true">
      Certify
    </v-btn>
    <v-dialog class="accent" v-model="dialog" persistent width="100vh">
      <v-card class="secondary primary--text">
        <div>
          <v-btn color="red" icon flat @click.stop="resetModal">
            <v-icon>close</v-icon>
          </v-btn>
          <form-wizard title="Research Certification" subtitle="" @on-error="handleErrorMessage" @on-complete="onComplete" color="#4a9ce1" ref="wizard">
            <tab-content :before-change="validateFirstTab" key="Hash" title="Hash" icon="fas fa-hashtag">

              <CertifyUpload :revert="revert" />
              <v-layout justify-center v-if="errorMsg">
                <v-flex xs4 sm4 md4 lg4>
                  <div class="text-xs-center">
                    <v-alert :value="true" type="error">
                      {{errorMsg}}
                    </v-alert>
                  </div>
                </v-flex>
              </v-layout>
            </tab-content>

            <tab-content key="Info" title="Info" icon="fas fa-id-card">
              <div class="animated fadeIn delay-0.5s">
                <CertifyInfo :revert="revert" />
              </div>
            </tab-content>
            <tab-content id="thirdtab" key="Certify" title="Certify" icon="fas fa-pen-square" :before-change="validateThirdTab">
              <CertifyCertificate :revert="revert" />
              <v-layout align-center justify-center v-if="errorMsg">
                <v-flex xs6 sm6 md6 lg6>
                  <v-alert :value="true" type="error">
                    {{errorMsg}}
                  </v-alert>
                </v-flex>
              </v-layout>
            </tab-content>
            <v-btn slot="prev">Back</v-btn>
            <v-btn slot="next">Next</v-btn>
            <v-btn slot="finish">Finish</v-btn>
          </form-wizard>
        </div>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import certBackground from '../assets/certbackground3.jpg'
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import CertifyUpload from './CertifyUpload'
import CertifyCertificate from './CertifyCertificate'
import CertifyInfo from './CertifyInfo'
import axios from 'axios'
const FileSaver = require('file-saver')

// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
export default {
  name: 'certify-modal',
  data () {
    return {
      dialog: false,
      errorMsg: null,
      transactionReceipt: '',
      revert: false,
      certBackgroundURL: '',
      certBackground: certBackground,
      confirmedTransactionTimestamp: ''
    }
  },
  components: {
    FormWizard,
    TabContent,
    CertifyUpload,
    CertifyCertificate,
    CertifyInfo
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

    validateFirstTab: function () {
      return new Promise((resolve, reject) => {
        if (this.$store.state.user.validatedUpload !== true) {
          reject('Please create a Hash')
        } else {
          this.revert = true
          resolve(true)
        }
      })
    },
    validateThirdTab: function () {
      return new Promise((resolve, reject) => {
        if (this.$store.state.user.validatedTransaction !== true) {
          reject('Please wait until the transaction is fully confirmed.')
        } else {
          this.revert = true
          resolve(true)
        }
      })
    },
    handleErrorMessage: function (errorMsg) {
      this.errorMsg = errorMsg
    },
    onComplete: async function () {
      let certificateVariables = this.$store.state.user.dataURL
      var API_URL
      var headers
      if (process.env.CLIENT_ENV === 'development') {
        API_URL = 'http://localhost:7000/generatePDF'
        headers = {'api_key': process.env.DEV_API_KEY}
      } else if (process.env.CLIENT_ENV === 'testing') {
        API_URL = 'https://qa.certify.bloxberg.org/generatePDF'
        headers = {'api_key': process.env.QA_API_KEY}
      } else if (process.env.CLIENT_ENV === 'production') {
        API_URL = 'https://certify.bloxberg.org/generatePDF'
        headers = {'api_key': process.env.PROD_API_KEY}
      }
      axios.post(API_URL, certificateVariables, {responseType: 'arraybuffer', headers})
          .then(response => {
            var blob = new Blob([response.data], {type: 'application/x-zip-compressed'})
            FileSaver.saveAs(blob, 'BloxbergDataCertificates.zip')
            this.revert = true
            this.resetModal()
          })
    },

    resetModal: function () {
      // Reset all user data associated with Certification
      this.revert = true
      this.dialog = false
      this.$store.state.user.dataURL = ''
      this.$store.state.user.authorName = ''
      this.$store.state.user.checksum = ''
      this.$store.state.user.researchTitle = ''
      this.$store.state.user.mintAddress = ''
      this.$store.state.user.emailAddress = ''
      this.$store.state.user.transactionReceipt = ''
      // this.$store.state.user.validatedUpload = false
      this.errorMsg = null
      this.revert = false
      this.$refs.wizard.reset()
    }
  }
}
</script>

<style scoped>
.wizard-tab-content {
  display: flex;
}
#thirdtab {
  display: flex;
}
</style>
