<template>

  <div id="certify">
    <v-app id="background">

      <v-navigation-drawer fixed clipped class="secondary" app v-model="drawer">
        <v-list two-line>
          <v-list-tile :to="{path: '/'}">
            <v-list-tile-action>
              <v-icon class="accent--text">fas fa-award</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="title primary--text">Certify</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile :to="{path: '/verify'}">
            <v-list-tile-action>
              <v-icon class="accent--text">fas fa-clipboard-check</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="title primary--text">Verify</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar class="white" app clipped-left>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title id="bloxbergbutton" class="mr-5">
          <a class="navbar-brand" href="/">
            <img id="logo" src="../assets/logo.png" alt="">
          </a>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items id="toolbaritems">
          <v-btn class="primary--text" :to="{name: 'CertifyComponent'}" flat>Certify & Verify</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <main>
        <v-fade-transition>
          <router-view></router-view>
        </v-fade-transition>
        <!-- <v-fade-transition :group="transitionGroup" mode="out-in">
          <router-view key="cert"></router-view>
          <router-view key="veri" class="view two" name="transactionTable"></router-view>
        </v-fade-transition> -->
      </main>
    </v-app>
  </div>
</template>

<script>
import NavbarApp from './NavbarApp'
import CertifyModal from './CertifyModal'
import Verify from './Verify'
import store from '../store'
import { mapState, mapActions } from 'vuex'
import { ACTION_TYPES } from '../util/constants'
import UserManager from '../js/UserManager'
import monitorWeb3 from '../util/web3/monitorWeb3'
export default {
  props: ['currentView'],
  components: {
    NavbarApp,
    CertifyModal,
    Verify
  },
  store,
  beforeCreate: function () {
    this.$store
      .dispatch(ACTION_TYPES.REGISTER_WEB3_INSTANCE)
      .then(result => {
        let state = result.state
        monitorWeb3(state)
        this.$store
          .dispatch(ACTION_TYPES.UPDATE_USER_BLOCKCHAIN_STATUS)
          .then(() => {
            if (!this.isDAppReady) {
              this.forcedIsValidUserBut = '0'
              this.$store.dispatch(ACTION_TYPES.UPDATE_DAPP_READINESS, true)
            }
          })
          .catch(() => {
            // console.log('Unable to UPDATE_USER_BLOCKCHAIN_STATUS')
            if (!this.isDAppReady) {
              this.$store.dispatch(ACTION_TYPES.UPDATE_DAPP_READINESS, true)
            }
          })
      })
      .catch((result = {}) => {
        let state = result.state
        this.forcedIsValidUserBut = '0'
        monitorWeb3(state)
        if (!this.isDAppReady) {
          this.$store.dispatch(ACTION_TYPES.UPDATE_DAPP_READINESS, true)
        }

        console.error(result, 'Unable to REGISTER_WEB3_INSTANCE')
      })
  },
  computed: {
    ...mapState({
      hasInjectedWeb3: state => state.web3.isInjected,
      hasWeb3InjectedBrowser: state => state.user.hasWeb3InjectedBrowser,
      isConnectedToApprovedNetwork: state =>
        state.user.isConnectedToApprovedNetwork,
      hasCoinbase: state => state.user.hasCoinbase,
      networkId: state => state.web3.networkId,
      coinbase: state => state.web3.coinbase,
      currentRoute: state => state.currentRoute,
      // currentView: state => state.currentView,
      user: state => state.user,
      isDAppReady: state => state.isDAppReady,
      isValidUserBut: state => state.isValidUserBut,
      originalIsValidUserBut: state => state.originalIsValidUserBut,
      gravatarURL: state => state.gravatarURL,
      avatarCanvas: state => state.avatarCanvas,
      defaultRoute: state => state.defaultRoute
    })
  },
  created: function () {
    this[ACTION_TYPES.CHANGE_CURRENT_ROUTE_TO](this.$route)
    this[ACTION_TYPES.SET_CURRENT_VIEW](this.$route)
  },
  data: function () {
    return {
      managers: {
        UserManager
      },
      drawer: null,
      title: 'bloxberg',
      color: 'secondary',
      transitionGroup: true,
      items: [1, 2]
    }
  },
  methods: {
    ...mapActions([
      ACTION_TYPES.CHANGE_CURRENT_ROUTE_TO,
      ACTION_TYPES.UPDATE_USER_GRAVATAR,
      ACTION_TYPES.SET_IS_VALID_USER_BUT,
      ACTION_TYPES.RESET_IS_VALID_USER_BUT,
      ACTION_TYPES.SET_CURRENT_VIEW,
      ACTION_TYPES.LOGIN
    ])
  },
  //   logUserIn (evt = null) {
  //     if (!this.user.isLoggedIn) {
  //       this.$root.callToAccessBlockchain({
  //         requestParams: {},
  //         contractIndexToUse: 'UserAuthManager',
  //         methodName: 'login',
  //         managerIndex: 'UserManager',
  //         callback: (isUserExists = false) => {
  //           if (evt) evt.target.disabled = false
  //           if (isUserExists) {
  //             UserManager.promisifyUserData(this.$store.state)
  //               .then(userObject => {
  //                 this.$store
  //                   .dispatch(ACTION_TYPES.LOGIN, {
  //                     userObject
  //                   })
  //                   .then(() => {
  //                     console.log('LOGIN Successful', this.user.isLoggedIn)
  //                     if (this.user.isLoggedIn) this.$router.push('/dashboard')
  //                     else this.$router.push('/home')
  //                   })
  //                   .catch(() => {
  //                     console.log('Unable to LOGIN')
  //                     if (!this.isDAppReady) {
  //                       this.$store.dispatch(
  //                         ACTION_TYPES.UPDATE_DAPP_READINESS,
  //                         true
  //                       )
  //                     }
  //                   })
  //               })
  //               .catch((result = {}) => {
  //                 console.error(result, 'Unable to fetch User Data')
  //                 if (result.isValid) {
  //                   this.$store
  //                     .dispatch(
  //                       ACTION_TYPES.INITIALISE_IS_VALID_USER_BUT,
  //                       result.warningMessage
  //                     )
  //                     .then(() => {
  //                       if (!this.isDAppReady) {
  //                         this.$store.dispatch(
  //                           ACTION_TYPES.UPDATE_DAPP_READINESS,
  //                           true
  //                         )
  //                       }
  //                     })
  //                     .catch(() => {
  //                       console.log('Unable to INITIALISE_IS_VALID_USER_BUT')
  //                       if (!this.isDAppReady) {
  //                         this.$store.dispatch(
  //                           ACTION_TYPES.UPDATE_DAPP_READINESS,
  //                           true
  //                         )
  //                       }
  //                     })
  //                 } else {
  //                   if (!this.isDAppReady) {
  //                     this.$store.dispatch(
  //                       ACTION_TYPES.UPDATE_DAPP_READINESS,
  //                       true
  //                     )
  //                   }
  //                 }
  //               })
  //           } else {
  //             this.$router.push('/')
  //           }
  //         }
  //       })
  //     } else {
  //       if (evt) evt.target.disabled = false
  //     }
  //   },
  //   logUserOut (evt = null) {
  //     this.$store.dispatch(ACTION_TYPES.LOGOUT).then(() => {
  //       if (evt) evt.target.disabled = false
  //       this.$router.push('/')
  //     })
  //   }
  // },
  watch: {
    hasInjectedWeb3 (web3ConnectionValue) {
      console.log('hasInjectedWeb3: ', web3ConnectionValue)
    },
    networkId (networkId) {
      console.log('networkId: ', networkId)
    },
    coinbase (coinbase) {
      console.log('coinbase: ', coinbase)
    },
    isDAppReady (isDAppReady) {
      console.log('isDAppReady: ', isDAppReady)
      // this.callSetIsValidUserBut(
      //   this.$route.query.isValidUserBut || this.forcedIsValidUserBut
      // )
    },
    $route (newRoute) {
      this[ACTION_TYPES.CHANGE_CURRENT_ROUTE_TO](newRoute)
      this[ACTION_TYPES.SET_CURRENT_VIEW](newRoute)
      const isValidUserBut = this.$route.query.isValidUserBut
      if (isValidUserBut) {
        // this.callSetIsValidUserBut(isValidUserBut)
      } else {
        // this.callResetIsValidUserBut()
      }
    }
  }
}
</script>

<style scoped>
#background {
  background: #eceff1;
  /* background: -webkit-linear-gradient(to right, #303F9F, #E8EAF6, #BDBDBD);
    background: linear-gradient(to right, #303F9F, #E8EAF6, #BDBDBD); */
}
#certificate {
  max-height: 30vh;
}
#lock {
  max-height: 30vh;
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
