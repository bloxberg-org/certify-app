<template>
  <v-app class="secondaryapp">
    <v-content>
      <v-container fluid>
        <v-layout justify-center>
          <v-flex id="heading2" xs12 sm12 md8 lg8>
            <v-card class="secondary primary--text" :raised=true>
              <v-card-title class="justify-center">
                <div class="headline text-centered">
                  <h3 class="primary--text">Verification</h3>
                </div>
              </v-card-title>
              <div class="text-xs-center primary--text mb-5">
                <h4 class="primary--text">Look up your data on the blockchain.</h4>
              </div>
              <div class="text-xs-center mb-5">
                <v-icon class="mainaccentlight--text" id="lock">fas fa-fingerprint
                </v-icon>
                <!-- <v-img id="lock" v-bind:src="require('../assets/lock.png')" contain></v-img> -->
              </div>
              <div class="body-2 text-xs-center primary--text mb-3">Have you already certified some data on our blockchain? Utilize this tool to look up your previously published data hash.

              </div>
              <div class="body-2 text-xs-center primary--text">
                <b>You must use the exact same data file you previously used to upload via the Certify tool</b>
              </div>
              <v-layout justify-center>
                <v-card-actions>
                  <VerifyModal/>
                </v-card-actions>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
import VerifyModal from './VerifyModal'
export default {
  name: 'certify',
  props: ['currentView'],
  components: {
    VerifyModal
  },
  data: () => ({
    drawer: null,
    title: 'bloxberg',
    color: 'secondary'
  })
}
</script>

<style scoped>
#background {
  background: #e3e3e3;
  /* background: -webkit-linear-gradient(to right, #303F9F, #E8EAF6, #BDBDBD);
    background: linear-gradient(to right, #303F9F, #E8EAF6, #BDBDBD); */
}
#certificate {
  max-height: 30vh;
}
#lock {
  font-size: 15vh;
}
#heading1 {
  margin-top: 5%;
  margin-right: 1%;
}
#heading2 {
  margin-top: 5%;
  margin-left: 1%;
}
#certifytext {
  padding-left: 1%;
  padding-right: 1%;
}
#title {
  text-decoration: none;
}
.transparent-background {
  background-color: rgba(0, 0, 0, 0);
}

#logo {
  height: 5vh !important;
}

#bloxbergbutton {
  margin-top: 0.5%;
}
</style>
