<template>
  <v-app class="secondaryapp">
    <v-content>
      <v-container fluid>
        <v-layout justify-center>
          <v-flex id="heading1" xs12 sm12 md8 lg8>
            <v-card class="secondary primary--text " :raised=true>
              <v-card-title class="justify-center">
                <div class="headline text-centered">
                  <h3>Certification</h3>
                </div>
              </v-card-title>
              <div class="text-xs-center primary--text mb-5">
                <h4>Certify your Research Data on the blockchain.</h4>
              </div>
              <div class="text-xs-center mb-5">
                <v-icon id="certificate" class="mainaccentlight--text">fas fa-certificate</v-icon>
              </div>
              <div id="certifytext" class="text-xs-center body-2 primary--text mb-3">This protects your intellectual property and safeguards against potential future scooping by generating a unique identifier from your data that is then stored on the chain. A certificate is then created to provide proof that this information belongs to you or your organization.
                <br>
                <br>
              </div>
              <v-layout justify-center>
                <v-card-actions>
                  <CertifyModal/>
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
import CertifyModal from './CertifyModal'

export default {
  name: 'certify',
  props: ['currentView'],
  components: {
    CertifyModal
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
  background: #18414c;
  /* background: -webkit-linear-gradient(to right, #303F9F, #E8EAF6, #BDBDBD);
    background: linear-gradient(to right, #303F9F, #E8EAF6, #BDBDBD); */
}
/* #certificate {
  max-height: 30vh;
} */
#certificate {
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
  padding-left: 7%;
  padding-right: 7%;
}
#title {
  text-decoration: none;
}
</style>
