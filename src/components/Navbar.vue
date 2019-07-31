

<template>
  <div>
    <v-navigation-drawer class="hidden-sm-and-up" disable-resize-watcher fixed right app v-model="drawer">
      <v-list class="hidden-sm-and-up">
        <v-list-tile :to="{path: '/'}">
          <v-list-tile-action>
            <v-icon class="accent--text">fas fa-award</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title primary--text">Certify & Verify</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{name: 'Faucet'}">
          <v-list-tile-action>
            <v-icon class="accent--text">fas fa-tint</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title primary--text">Faucet</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :to="{name: 'BlockExplorer'}">
          <v-list-tile-action>
            <v-icon class="accent--text">fas fa-th-large</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="title primary--text">Block Explorer</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar class="z-depth-0 primary--text" id="mainNav" :color=color scroll-off-screen :scroll-threshold=scrollthres fixed>
      <v-toolbar-title id="bloxbergbutton" class="mr-5">
        <a class="navbar-brand" href="#">
          <img id="logo" src="../assets/logo.png" alt="">
        </a>

      </v-toolbar-title>
      <h2 id="beta" class="subheading">Beta</h2>
      <v-spacer></v-spacer>
              <v-btn v-on:click="downloadWhitepaper" class="primary--text">Download Whitepaper</v-btn>
      <v-toolbar-side-icon class="hidden-sm-and-up" @click.stop="drawer = !drawer"></v-toolbar-side-icon>

      <v-toolbar-items id="toolbaritems" class="hidden-xs-only">

        <v-btn class="primary--text" :to="{name: 'CertifyComponent'}" flat>Certify & Verify</v-btn>
        <v-btn class="primary--text" :to="{name: 'Faucet'}" flat>Faucet</v-btn>
        <v-btn class="primary--text" :to="{name: 'BlockExplorer'}" flat>Explorer</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template> 

<script>
const axios = require('axios')
const FileSaver = require('file-saver')

export default {
  name: 'navbar',
  data: function () {
    return {
      title: 'Bloxberg',
      scrollthres: 50,
      scrolled: false,
      color: 'white',
      drawer: false
      // styleObject: {
      //   background: "transparent !important",
      //   opacity: "1 !important",
      //   border: "transparent !important"
      // }
    }
  },
  methods: {
    downloadWhitepaper: function () {
      axios({
        url: '/downloadWhitepaper',
        method: 'GET',
        responseType: 'blob'
      })
      .then(function (response) {
        var blob = new Blob([response.data], {type: 'application/pdf;charset=utf-8'})
        FileSaver.saveAs(blob, 'BloxbergWhitepaper.pdf')
      })
      .catch(function (error) {
        // handle error
        console.log(error)
      })
    }
  },
  watch: {},

  props: ['currentView']
}
</script>

<style scoped>
#title {
  text-decoration: none;
}
.transparent-background {
  background-color: rgba(0, 0, 0, 0);
}
#beta {
  margin-left: -2%;
  margin-top: 0.5%;
}

#bloxbergbutton {
  margin-left: 5%;
  margin-top: 0.5%;
}
#logo {
  height: 40px !important;
}
#nopadding {
  padding: 0px 0px 0px 0px;
}
</style>

