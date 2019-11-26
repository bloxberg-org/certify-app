<template>

    <v-card>
      <v-card-title>
      <div>
          <div id="bolder" class="body-2">Verify your transaction in the blockchain        </div>
          <div class="body-4">Table includes transactions from the past 12 hours. Please use the search to find earlier certifications.</div>
          </div>
 
        <v-spacer></v-spacer>
        
        <v-text-field
          v-model="search"
          label="Search for a Transaction ID"
          single-line
          hide-details
        >
        
        </v-text-field>
        <v-btn class = "accent secondary--text"
        v-on:click="searchTransaction(search)"> 
        <v-icon>fas fa-search</v-icon>
        </v-btn>
      </v-card-title>
      <v-data-table
        v-bind:pagination.sync="pagination"
        :headers="headers"
        :items="smartContractReturn"
        class="elevation-1"
      >
        <template
          slot="items"
          slot-scope="props"
        >
          <td>{{ props.item.timeStampConfirmed }}</td>
          <td class="text-xs-right">
            <a v-bind:href="'https://blockexplorer.bloxberg.org/tx/' + props.item.hash + '/internal_transactions'">{{ props.item.hash }} </a>
          </td>
          <td>{{props.item.checksum}}</td>
        </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
      </v-data-table>
    </v-card>
</template>
<script>
import Request from 'axios-request-handler'
import certifyResearchDataImport from '../../src/assets/createResearchDataABI.json'
import abiDecoder from 'abi-decoder'
const axios = require('axios')

export default {
  name: 'certifytransactions',
  data () {
    return {
      headers: [
        {
          text: 'Timestamp',
          align: 'left',
          sortable: true,
          value: 'timeStampConfirmed'
        },
        { text: 'Transaction ID', value: 'hash', sortable: false },
        { text: 'Checksum', value: 'checksum', sortable: false }
      ],
      smartContractAddress: '0xe5a9654c7e190701016ebf18206020bf16d8beab',
      smartContractReturn: [],
      timestamp: '',
      transaction: '',
      search: '',
      pagination: { sortBy: 'timeStampConfirmed', descending: true, rowsPerPage: 10 }
    }
  },
  methods: {
    getSmartContract: function () {
      var timeNow = Math.floor(Date.now() / 1000)

      var timeOneMonth = timeNow - 92571
      console.log(timeNow)
      console.log(timeOneMonth)

      const smartContractPolling = new Request(
        'https://blockexplorer.bloxberg.org/api?module=account&action=txlist&address=' +
          this.smartContractAddress + '&starttimestamp=' + timeOneMonth + '&endtimestamp=' + timeNow
      )
      var vm = this
      try {
        smartContractPolling
          .poll(50000000)
          .get(response => {
            console.log(response)
            response['data']['result'].shift()
            for (var key in response['data']['result']) {
              // let authorName = this.authorDecoder(response['data']['result'][key]['input'])
              // if (authorName === 'API Monitor') {
              //  break
              // } else {
              response['data']['result'][key]['timeStampConfirmed'] = this.timeConverter(
                  response['data']['result'][key]['timeStamp']
                )
              response['data']['result'][key]['checksum'] = this.checksumDecoder(
                  response['data']['result'][key]['input']
                )
              response['data']['result'][key]['timeStampSubmit'] = this.timeStampSubmitDecoder(
                  response['data']['result'][key]['input']
                )
              // }
              vm.smartContractReturn.push(response['data']['result'][key])
            }
          })
          .then(contractData => {
          })
      } catch (err) {
        console.log(err)
      }
    },
    timeConverter: function (unixTimestamp) {
      var a = new Date(unixTimestamp * 1000)
      var months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
      var year = a.getFullYear()
      var month = months[a.getMonth()]
      var date = a.getDate()
      var hour = a.getUTCHours()
      var min = '0' + a.getUTCMinutes()
      var sec = '0' + a.getUTCSeconds()
      var time =
        date +
        ' ' +
        month +
        ' ' +
        year +
        ' ' +
        hour +
        ':' +
        min.substr(-2) +
        ':' +
        sec.substr(-2) +
        ' (UTC)'
      return time
    },
    checksumDecoder: function (rawInput) {
      abiDecoder.addABI(certifyResearchDataImport)
      const result = abiDecoder.decodeMethod(rawInput)
      if (typeof result !== 'undefined') {
        return result['params'][0]['value']
      } else {
        return null
      }
    },
    timeStampSubmitDecoder: function (rawInput) {
      abiDecoder.addABI(certifyResearchDataImport)
      const result = abiDecoder.decodeMethod(rawInput)
      if (typeof result !== 'undefined') {
        result['params'][3]['value'] = this.timeConverter(result['params'][3]['value'])
        return result['params'][3]['value']
      } else {
        return null
      }
    },
    authorDecoder: function (rawInput) {
      abiDecoder.addABI(certifyResearchDataImport)
      const result = abiDecoder.decodeMethod(rawInput)
      if (typeof result !== 'undefined') {
        return result['params'][2]['value']
      } else {
        return null
      }
    },
    searchTransaction: function (txid) {
      let transactionQuery = 'https://blockexplorer.bloxberg.org//api?module=transaction&action=gettxinfo&txhash=' + txid
      axios.get(transactionQuery)
      .then(response => {
        console.log(response['data']['result'])
        response['data']['result']['timeStampConfirmed'] = this.timeConverter(
                response['data']['result']['timeStamp']
                )
        response['data']['result']['checksum'] = this.checksumDecoder(
                response['data']['result']['input']
                )
        response['data']['result']['timeStampSubmit'] = this.timeStampSubmitDecoder(
                response['data']['result']['input']
                )
        console.log(this.smartContractReturn)
        this.smartContractReturn = []
        this.smartContractReturn.push(response['data']['result'])
      })
      .catch(function (error) {
        console.log(error)
      })
    }
  },
  created () {
    this.getSmartContract()
  }
}
</script>

<style>
#bolder {
font-size: 24px !important;
}
</style>
