<template>
  <div class = "primary--text">
    <blockcerts-verifier display-mode="card"></blockcerts-verifier>
  </div>
</template>

<script>
import certFile from '../assets/testing.json'
import '@bloxberg-org/blockcerts-verifier/dist/ie11.js'

export default {
  name: 'Blockcerts',
  mounted () {
    // let externalScript = document.createElement('script')
    // externalScript.setAttribute('src', 'https://unpkg.com/@bloxberg-org/blockcerts-verifier@latest/dist/main.js')
    // document.head.appendChild(externalScript)
  },
  data () {
    return {
      myJson: '../assets/testing.json',
      test: certFile
    }
  }
}
</script>

<style scoped>

</style>
