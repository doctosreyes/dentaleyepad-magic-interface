<template>
  <div>
    <q-btn v-if="outputIsRomexis" @click="startRomexisLoaderBat" class="ouputButton">{{ $t('components.buttons.romexis.label') }}</q-btn>
    <q-btn @click="openXnView" class="ouputButton" v-else>XnView</q-btn>
  </div>
</template>
<script setup>
import log from 'electron-log'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useQrCodeStore } from 'src/stores/qr-code-store'

// #region XNVIEW
const targetPath = ref(null)
const XnViewPath = ref(null)
const qrCodeStore = useQrCodeStore()

const openXnView = async () => {
  log.debug('OutPutButton -> openXnView')
  const { qr } = storeToRefs(qrCodeStore)
  log.debug('openXnView -> QR: ', qr.value)
  const qrArr = qr.value.split('|')
  const lastName = qrArr[2]
  const firstName = qrArr[3]
  const id = qrArr[1]
  const birthday = qrArr[4]
  const patientPath = `${lastName} ${firstName} ${typeof id === 'undefined' || id === '' ? birthday : id}`
  let completePatientPath
  if (typeof id === 'undefined' && typeof birthday === 'undefined') {
    completePatientPath = `${targetPath.value}\\`
  } else {
    completePatientPath = `${targetPath.value}\\${patientPath}`
  }
  log.debug(`completePatientPath: ${completePatientPath}`)
  const openXnViewForPatient = `"${XnViewPath.value}" "${completePatientPath}"`

  log.debug(`openXnViewForPatient path: ${openXnViewForPatient}`)
  try {
    window.pl.send('checkDirAndMake', completePatientPath)
    const result = await window.pl.invoke('executeCmd', openXnViewForPatient)
    log.info(`OUTPUTBUTTON -> openXnViewPatient: ${result}`)
  } catch (error) {
    log.error(`Error: ${error.error}\nStderr: ${error.stderr}`)
  }
}

onMounted(() => {
  window.pl.getSettingValue('paths.xnview')
    .then((res) => {
      XnViewPath.value = res
    })

  window.pl.getSettingValue('dccTargetDir') // TODO Change to dataFile before use in PRODUCTION
    .then((res) => {
      targetPath.value = res
    })
})
// #endregion

// #region ROMEXIS
const outputIsRomexis = ref(false)
const startRomexisLoaderBat = () => {
  window.pl.send('startRomexisLoaderBat')
}
// #endregion

onMounted(() => {
  window.pl.getSettingValue('output')
    .then((res) => {
      log.debug(`outputIsRomexis: ${res}`)
      if (res === 'Romexis') { outputIsRomexis.value = true }
    })
    .catch(err => log.error(err))
})
</script>
<style scoped>
  .ouputButton {
    position: relative;
    font-size: 0.7rem;
    width: 90%;
    max-height: 44px;
    margin-left: 5%;
  }
</style>
