<template>

    <v-card>
      <v-card-title>
        <div id="bolder" class="body-2">Verify your transaction in the blockchain</div>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search for an Transaction ID, Hash, or Date"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        v-bind:pagination.sync="pagination"
        :search="search"
        :headers="headers"
        :items="smartContractReturn"
        class="elevation-1"
      >
        <template
          slot="items"
          slot-scope="props"
        >
          <td>{{ props.item.timeStampSubmit }}</td>
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

export default {
  name: 'certifytransactions',
  data () {
    return {
      headers: [
        {
          text: 'Timestamp',
          align: 'left',
          sortable: true,
          value: 'timeStampSubmit'
        },
        { text: 'Transaction ID', value: 'hash', sortable: false },
        { text: 'Checksum', value: 'checksum', sortable: false }
      ],
      smartContractAddress: '0xe5a9654c7e190701016ebf18206020bf16d8beab',
      smartContractReturn: [],
      timestamp: '',
      transaction: '',
      search: '',
      pagination: { sortBy: 'timeStamp', descending: true, rowsPerPage: 10 }
    }
  },
  methods: {
    getSmartContract: function () {
      const smartContractPolling = new Request(
        'https://blockexplorer.bloxberg.org/api?module=account&action=txlist&address=' +
          this.smartContractAddress
      )
      var vm = this
      try {
        smartContractPolling
          .poll(500000)
          .get(response => {
            response['data']['result'].shift()
            for (var key in response['data']['result']) {
              response['data']['result'][key]['timeStampConfirmed'] = this.timeConverter(
                response['data']['result'][key]['timeStamp']
              )
              response['data']['result'][key]['checksum'] = this.checksumDecoder(
                response['data']['result'][key]['input']
              )
              response['data']['result'][key]['timeStampSubmit'] = this.timeStampSubmitDecoder(
                response['data']['result'][key]['input']
              )
            }
            vm.smartContractReturn = response['data']['result']
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
