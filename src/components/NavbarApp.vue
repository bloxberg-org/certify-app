<template>
  <v-toolbar class="z-depth-3 secondary" id="mainNav">
    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    <v-toolbar-title id="bloxbergbutton" class="mr-5">
      <a class="navbar-brand" href="/">
        <img id="logo" src="../assets/logo.png" alt="">
      </a>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items id="toolbaritems">
      <v-btn class="primary--text" :to="{name: 'CertifyComponent'}" flat>Certify & Verify</v-btn>
      <v-btn class="primary--text" :to="{name: 'Faucet'}" flat>Faucet</v-btn>
      <v-btn class="primary--text" :to="{name: 'BlockExplorer'}" flat>Explorer</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>

export default {
  name: 'navbar',
  data: function () {
    return {
      title: 'bloxberg',

      color: 'secondary'
    }
  },
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

#logo {
  height: 5vh !important;
}

#bloxbergbutton {
  margin-left: 5%;
  margin-top: 0.5%;
}
</style>
