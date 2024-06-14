<template>
  <div>
    <QrCodeButton></QrCodeButton>
    <q-card class="q-mt-sm q-pa-sm">
      <div class="row">

        <div class="col-4">
          <div>
            <q-btn @click="selectDccDirPath">Wähle Zielverzeichnis</q-btn>
          </div>
        </div>

        <div class="col-8">
          <div class="q-ml-md">
            {{ t('components.settings.dccTargetDir.btn') }} <br/>{{ dccTargetDirPath }}
          </div>
          <div v-if="readError" class="row text-negative">
            <p>
              {{ readError }}
            </p>
          </div>
          <div v-if="warning" class="row text-warning">
            <p>
              {{ warning }}
            </p>
          </div>
        </div>
      </div>
      <hr/>
      <strong>Daten</strong>
      <div class="row">
        <div class="col-6">
          Connector: {{ dccSettings !== null ? dccSettings.connector : '' }} <br/>
          IPs: {{ dccSettings !== null ? dccSettings.ips : '' }}
        </div>

        <div class="col-6">
          Output: {{ dccSettings !== null ? dccSettings.output : '' }}
        </div>

      </div>
      <hr/>
    </q-card>
  </div>
</template>
<script setup>
import log from 'electron-log'
import useSelectPath from '../../compopsables/useSelectPath.js'
import QrCodeButton from '../buttons/QrCodeButton.vue'
import { ref, onMounted, watch } from 'vue'
// import axios from 'axios'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const { selectPath, selectedPath } = useSelectPath()
const dccTargetDirPath = ref(undefined)
const readError = ref(false)
const dccSettings = ref(null)
const warning = ref(false)
const showHomeBtn = ref(false)

onMounted(() => {
  window.pl.getSettingValue('dccTargetDir')
    .then((res) => {
      dccTargetDirPath.value = res
      _readDccDataFile()
    }).catch(err => log.error(err))
})

const selectDccDirPath = () => {
  log.debug('selectDccDirPath')
  dccTargetDirPath.value = ''
  readError.value = false
  selectPath({ properties: ['openDirectory'] })
  log.debug(`selectedPath: ${selectedPath.value}`)
}

watch(selectedPath, (filePaths) => {
  log.debug(`DccDirPath -> changed selectedPath: ${JSON.stringify(selectedPath.value)}, filePaths: ${JSON.stringify(filePaths)}`)
  dccTargetDirPath.value = filePaths[0]
  if (typeof dccTargetDirPath.value !== 'undefined') window.pl.send('settingSet', { key: 'dccTargetDir', value: dccTargetDirPath.value })
  _readDccDataFile()
})

function _readDccDataFile () {
  const dccDataFilePath = dccTargetDirPath.value + '/DccData.json'
  window.pl.fsReadFile(dccDataFilePath, 'utf-8', (err, data) => {
    if (err) {
      log.error(err)
      readError.value = err
    } else {
      log.debug(`dccSettings: ${data}`)
      dccSettings.value = JSON.parse(data)
      log.debug(`DccTargetDir _readDccDataFile dccSettings.ips.length: ${dccSettings.value.ips.length}`)
      if (dccSettings.value.ips.length > 0) {
        _checkDccConnection()
      }
    }
  })
}

function _checkDccConnection () {
  if (typeof dccSettings.value.output !== 'undefined' && dccSettings.value.output !== '') {
    window.pl.send('settingSet', { key: 'output', value: dccSettings.value.output })
  } else {
    readError.value += 'ERROR: output could not been set - call doctorseyes support'
  }
  if (typeof dccSettings.value.connector !== 'undefined' && dccSettings.value.connector !== '') {
    window.pl.send('settingSet', { key: 'connector', value: dccSettings.value.connector })
    if (dccSettings.value.connector === 'charly') { // CONNECTOR === CHARLY
      window.pl.send('settingSet', { key: 'patientFile', value: true })
      if (process.env.DEV) {
        log.debug('patmanager RESTART')
        return
      } else {
        window.pl.send('app:relaunch')
      }
    } else {
      window.pl.send('settingSet', { key: 'patientFile', value: false })
    }
    // window.pl.send('settingSet', { key: 'ouput', value: dccSettings.value.connector })
  } else {
    readError.value += 'ERROR: connnector could not been set - call doctorseyes support'
  }
  if (typeof dccSettings.value.patManRoot !== 'undefined' && dccSettings.value.patManRoot !== '') {
    window.pl.send('settingSet', { key: 'dccMediaManagement', value: dccSettings.value.patManRoot })
  }
  window.pl.send('settingSet', { key: 'dccTargetDir', value: dccTargetDirPath.value })
  showHomeBtn.value = true
  /* const test = true
  const ips = dccSettings.value.ips
  const port = dccSettings.value.port
  ips.forEach(ip => {
    log.debug('_checkDccConnection ip:', ip)
    const dccAdress = `http://${ip}:${port}/check` // TODO set CSP "connect-src" in index.html --- ALSO -> set cors in dcc
    log.debug('_checkDccConnection dccAdress:', dccAdress)
    axios({
      method: 'get',
      url: dccAdress
    })
      .then((res) => {
        log.debug(`SUCCESS axios get ${dccAdress} response: ${res}`)
      })
      .catch((err) => {
        readError.value += `\n${dccAdress} error:\n${err}`
      })
  }) */
}
</script>
