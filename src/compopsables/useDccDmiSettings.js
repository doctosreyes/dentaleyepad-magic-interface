import log from 'electron-log'
import { ref } from 'vue'

export default function useDccDmiSettings () {
  const dccTargetDirPath = ref(undefined)
  const readError = ref(false)
  const dccSettings = ref(null)
  const warning = ref(false)
  // const hasDccTargetDir = ref(false)

  const hasDccTargetDir = ref(true)

  function getTargetDirPathAndReadData () {
    window.pl.getSettingValue('dccTargetDir')
      .then((res) => {
        log.debug(`getSettingValue('dccTargetDir'): ${res}`)
        if (res !== '' && typeof res !== 'undefined') {
          dccTargetDirPath.value = res
          _readDccDataFile()
        } else {
          hasDccTargetDir.value = false
        }
      }).catch(err => log.error(err))
  }

  function _readDccDataFile () {
    const dccDataFilePath = dccTargetDirPath.value + '\\DccData.json'
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

  return {
    hasDccTargetDir,
    dccSettings,
    warning,
    readError,
    dccTargetDirPath,
    getTargetDirPathAndReadData
  }
}
