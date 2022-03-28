<template>

  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container>
        <v-layout row wrap>
          <div class="text-xs-center">
            <p>Every field is optional, it is only to enhance the generated certificate at the end of the process. If you don't wish to provide any information, simply click next.</p>
          </div>
          <v-flex xs12 md12 md6 lg6 class="my-3 text-xs-center" align-center>
            <v-text-field v-model="authorName" v-on:change="nameChange" label="Author or Group Name" hint="Enter your group or author(s) research was conducted with" persistent-hint outline></v-text-field>
          </v-flex>
          <v-flex xs12 md12 md6 lg6 class="my-3 text-xs-center" align-center>
            <v-text-field v-model="mintAddress" v-on:change="mintaddressChange" :rules="mintRules" :success="!!mintAddress" label="Bloxberg Address" hint="Enter your bloxberg address that you would like the certification to be minted to (Format: 0x...)." persistent-hint outline></v-text-field>
          </v-flex>
          <v-flex xs12 md12 md6 lg6 class="my-3 text-xs-center" align-center>
            <v-text-field v-model="researchTitle" v-on:change="titleChange" label="Title or Brief Description of Research" hint="Enter a brief description of what the data entails" persistent-hint outline></v-text-field>
          </v-flex>
          <v-flex xs12 md12 md6 lg6 class="my-3 text-xs-center" align-center>
            <v-text-field v-model="emailAddress" v-on:change="emailChange" :rules="emailRules" :success="!!emailAddress" label="Email Address" hint="If you wish an email address to be associated with the data" persistent-hint outline></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </div>
</template>

<script>
    export default {
      props: ['revert'],
      name: 'certify-info',
      components: {},
      data () {
        return {
          authorName: '',
          researchTitle: '',
          mintAddress: '',
          emailAddress: '',
          emailRules: [
            v => (v.match(/(?:.+@.+\..+)?/) && v.match(/(?:.+@.+\..+)?/)[0] === v) || 'Invalid E-Mail (will not be used)'
          ],
          mintRules: [
            v => (v.match(/(?:0x.{40})?/) && v.match(/(?:0x.{40})?/)[0] === v) || 'Invalid Address, required format: 0x... (will not be used)'
          ],
          valid: ''
        }
      },
      watch: {
        revert (value) {
          if (value === true) {
            this.authorName = ''
            this.researchTitle = ''
            this.mintAddress = ''
            this.emailAddress = ''
            this.valid = ''
          }
        }
      },
      methods: {
        nameChange: function () {
          this.$store.state.user.authorName = this.authorName
        },
        mintaddressChange: function () {
          if (v.match(/(?:0x.{40})?/) && v.match(/(?:0x.{40})?/)[0] === v) {
            this.$store.state.user.mintAddress = this.mintAddress
          } else {
            this.$store.state.user.mintAddress = ''
          }
        },
        titleChange: function () {
          this.$store.state.user.researchTitle = this.researchTitle
        },
        emailChange: function () {
          if (v.match(/(?:.+@.+\..+)?/) && v.match(/(?:.+@.+\..+)?/)[0] === v) {
            this.$store.state.user.emailAddress = this.emailAddress
          } else {
            this.$store.state.user.emailAddress = ''
          }
        }
      }
    }
</script>

<style scoped>
</style>
