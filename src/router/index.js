import Vue from 'vue'
import Router from 'vue-router'
import Certify from '@/components/Certify'
import CertifyPage from '@/components/CertifyPage'
import Verify from '@/components/Verify'
import CertifyTransactionHistory from '@/components/CertifyTransactionHistory'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   mode: 'history',
    //   path: '/',
    //   name: 'Root',
    //   component: Home,
    //   meta: { view: Web3Message }
    // },
    // {
    //   mode: 'history',
    //   path: '/home',
    //   name: 'Home',
    //   component: Home,
    //   meta: { view: Web3Message }
    // },
    {
      mode: 'history',
      path: '/',
      name: 'Certify',
      component: CertifyPage,
      children: [
        {
          path: '/',
          name: 'CertifyComponent',
          component: Certify
        },
        {
          path: '/verify',
          name: 'VerifyComponent',
          components: {
            default: Verify,
            transactionTable: CertifyTransactionHistory
          }
        }
      ]
    },
    {
      mode: 'history',
      path: '/faucet',
      name: 'Faucet',
      beforeEnter (to, from, next) {
        // Put the full page url including the protocol http(s) below
        window.location = 'https://faucet.bloxberg.org'
      }
    },
    {
      mode: 'history',
      path: '/blockexplorer',
      name: 'BlockExplorer',
      beforeEnter (to, from, next) {
        // Put the full page url including the protocol http(s) below
        window.location = 'https://blockexplorer.bloxberg.org'
      }
    }
  ],
  mode: 'history'
})
