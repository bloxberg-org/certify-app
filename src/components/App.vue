<template>
  <div id="app">
    <router-view>
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    // logUserIn (evt) {
    //   this.$emit('log-user-in', evt)
    // },
    // logUserOut (evt) {
    //   this.$emit('log-user-out', evt)
    // }
  }
  // props: ['isDAppReady', 'currentView', 'isValidUserBut']
}
</script>

<style>
</style>
