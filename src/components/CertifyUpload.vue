<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container>
        <v-layout justify-center>
          <div class="text-xs-center">
            <v-flex xs12 sm12 md12 lg12>
              <h3>
                How would you like to generate the hash?
              </h3>
              <v-radio-group v-model="fromFile" row>
                <v-radio label="Generate from File(s)" value=true></v-radio>
                <v-radio label="Manual Entry" value=false></v-radio>
              </v-radio-group>
            </v-flex>
          </div>
        </v-layout>
        <v-layout row wrap>
          <v-layout v-if="fromFile === 'true'" justify-center>
            <div class="upload-btn">
              <input id="uploadFile" value=null type="file" name="uploadFile" @change="captureFile" multiple />
              <label for="uploadFile" v-ripple class="mainaccent secondary--text v-btn v-btn--large upload-btn upload-btn-hover">
                Generate from File
                <i class="fas fa-file-import"> </i>
              </label>
            </div>
          </v-layout>
          <v-flex v-if="fromFile === 'true'" xs12 sm12>
            <v-text-field class="primary--text" v-model="fileName" :hint="hashchecksum" :label=label :success="!!fileName" :append-icon=appendicon readonly persistent-hint outline required></v-text-field>
          </v-flex>
          <v-flex v-if="fromFile === 'false'" class="accent--text" xs12 sm12>
            <v-text-field v-model="manualchecksum" @change="manualcheck" label="Enter Hash Manually" :success="!!checksum" hint="If you prefer generating your own hash for your data, enter it here." persistent-hint outline></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </div>
</template>

<script>
// import Vue from 'vue'
import UploadButton from 'vuetify-upload-button'
var CryptoJS = require('crypto-js')

export default {
  props: ['revert'],
  name: 'certify-upload',
  data: function () {
    return {
      appendicon: 'block',
      completeIcon: '',
      label: 'File Name(s)',
      authorName: '',
      files: undefined,
      btnMsg: 'Submit Hash',
      divider: true,
      fileName: '',
      revertValue: this.revert,
      valid: true,
      btncolor: '',
      fromFile: null,
      manualchecksum: null,
      hashchecksum: 'Please select your desired file',
      checksum: [],
      buffer: ''
    }
  },
  watch: {
    revert: function (newVal, oldVal) { // watch it
      console.log(newVal)
      if (newVal === true) {
        this.completeIcon = ''
        this.files = undefined
        this.fileName = null
        this.btnMsg = 'Submit Hash'
        this.btncolor = ''
        this.appendicon = 'block'
        this.hashchecksum = 'Please select your desired file'
        this.manualchecksum = null
        this.checksum = []
        this.$refs.form.resetValidation()
        this.$store.state.user.validatedUpload = false // Update the state to reset form validation
      }
    },
    deep: true
  },
  created () {

  },
  components: {
    'upload-btn': UploadButton
  },

  methods: {
    manualcheck: function (event) {
      // this.fileName = ' '
      this.checksum = this.manualchecksum
      this.updateStore()
    },
    captureFile: function (event) {
      this.value = null
      this.files = event.target.files
      for (var i = 0; i < this.files.length; i++) {
        event = this.files[i]
        this.fileName += this.files[i].name + ', '
        const file = event
        try {
          let reader = new window.FileReader()
          reader.readAsArrayBuffer(file)
          reader.onloadend = () => this.convertToBuffer(reader)
        } catch (err) {
          console.log(err)
        }
      }
    },

    convertToBuffer: function (reader) {
      try {
        let wordArray = CryptoJS.lib.WordArray.create(reader.result)
        let hash = CryptoJS.SHA256(wordArray).toString()
        this.checksum.push(hash)
        this.hashchecksum = 'Hash(es): ' + this.checksum
        const buffer = Buffer.from(reader.result)
        // //set this buffer -using es6 syntax
        this.buffer = buffer
        // for Chrome you must set the upload value to null
        document.getElementById('uploadFile').value = null
        this.updateStore()
      } catch (err) {
        console.log(err)
      }
    },

    updateStore () {
      this.$store.state.user.checksum = this.checksum
      this.$store.state.user.validatedUpload = true
      this.appendicon = 'check'
    }
  }
}
</script>

<style scoped>
#uploadbtn {
  margin-left: -15px;
}
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
  cursor: pointer;
}
.divider {
  margin-top: 2.7%;
}
.fa-file-import {
  padding-left: 5px;
}
</style>
