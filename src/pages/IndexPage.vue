<template>
  <div>
    <div>
      <QrCode></QrCode>
    </div>
  </div>
</template>

<script setup>
import QrCode from 'src/components/QrCode.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import log from 'electron-log'
import { useRouter } from 'vue-router'

const router = useRouter()

defineOptions({
  name: 'IndexPage'
})

// #region DccDirDialog
onMounted(() => {
  window.pl.getSettingValue('dccTargetDir')
    .then((res) => {
      log.debug(`IndexPage onMounted dccTargetDir : ${res}`)
      if (res === '') {
        router.push('/setDccTargetDir')
        /* log.debug('open modal to select dcc target dir path')
        const dialogObj = { title: 'Hinweis', message: 'Bitte zuerst Software wählen' }
        const myDialog = new MyDialog(dialogObj)
        log.debug(`dialog object: ${JSON.stringify(myDialog)}`) */
      }
    })
    .catch(err => log.error(err))
})

// #region UPDATE
onMounted(() => {
  window.pl.receive('update:show', (ev, data) => {
    log.debug('MainLayout-> onMounted received update:show')
    router.push('/update')
  })
})
onUnmounted(() => {
  window.pl.removeReceiveListener('update:show')
})
// #endregion

const patientFileInterval = ref(null)
const pathPatientFile = ref(null)
const patientFileData = ref(null)

onMounted(() => {
  window.pl.hasSetting('patientFileData')
    .then((data) => {
      if (data) {
        window.pl.getSettingValue('patientFileData')
          .then((data) => {
            patientFileData.value = data
            log.debug(`IndexPage onMounted patientFileData.value: ${patientFileData.value}`)
          })
      } else {
        patientFileData.value = false
        log.debug('IndexPage onMounted patientFileData.value: false')
      }
    })
    .catch(err => log.error(err))

  window.pl.getSettingValue('patientFile')
    .then((patientFile) => {
      if (patientFile) {
        patientFileInterval.value = setInterval(() => {
          readPatientFile()
        }, 1000)
        log.debug(`IndexPage onMounted patientFileInterval.value: ${patientFileInterval.value}`)
      } else {
        clearInterval(patientFileInterval.value)
        log.debug(`IndexPage onMounted clearInterval(patientFileInterval.value): ${patientFileInterval.value}`)
      }
    })
    .catch(err => log.error(err))

  window.pl.getSettingValue('paths.programData')
    .then((dirPath) => {
      const filePath = `${dirPath}\\patient.txt`
      pathPatientFile.value = filePath
      log.debug(`IndexPage onMounted pathPatientFile.value: ${pathPatientFile.value}`)
    })
    .catch(err => log.error(err))
})
onUnmounted(() => {
  clearInterval(patientFileInterval.value)
  log.debug(`IndexPage onUnmounted clearInterval(patientFileInterval.value): ${patientFileInterval.value}`)
  window.pl.removeReceiveListener('patientsFile')
  window.pl.removeReceiveListener('patientFileData')
})

const readPatientFile = () => {
  window.pl.fsStat(pathPatientFile.value, (err, stats) => {
    if (err) {
      if (err.code !== 'ENOENT') log.error('readPatientFile: ' + err)
    } else {
      // print file last modified date
      // log.debug(`File Data Last Modified: ${stats.mtime}`)
      // log.debug(`File Status Last Modified: ${stats.ctime}`)
      const fileTime = stats.mtime
      if (typeof patientFileData.value === 'string') patientFileData.value = new Date(patientFileData.value)
      // log.debug('types', patientFileData.value, typeof patientFileData.value, fileTime, typeof fileTime)
      if (patientFileData.value.valueOf() !== fileTime.valueOf()) {
        window.pl.fsReadFile(pathPatientFile.value, 'latin1', (err, data) => {
          if (err) {
            log.error(err)
          } else {
            window.pl.send('settingSet', { key: 'patientFileData', value: fileTime })
            window.pl.send('args', process.env.DEV ? data : data)
            patientFileData.value = fileTime
          }
        })
      }
    }
  })
}
</script>
