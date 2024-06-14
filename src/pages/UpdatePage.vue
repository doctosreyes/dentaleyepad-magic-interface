<template>
  <q-page padding>
    <QrCodeButton></QrCodeButton>
    <q-btn v-if="isUpdateAvailable" @click="makeUpdate" class="q-mt-md">
      download update
    </q-btn>
    <span v-if="showProgress">{{ downloadProgess }} %</span>
    <p v-if="updateError">Error:<br/>{{ updateError }}</p>
  </q-page>
</template>
<script setup>
import QrCodeButton from 'src/components/buttons/QrCodeButton.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import log from 'electron-log'

// #region AVAILABLE
const isUpdateAvailable = ref(false)
onMounted(() => {
  window.pl.getSettingValue('updateAvailable')
    .then((res) => {
      log.debug('UpdatePage mounted isUpdateAvailable: ' + res)
      isUpdateAvailable.value = res
    })
})
onUnmounted(() => {
  window.pl.removeReceiveListener('updateAvailable')
})
// #endregion

// #region MAKE
const downloadProgess = ref(0)
const showProgress = ref(false)
const updateError = ref(false)
const makeUpdate = () => {
  showProgress.value = true
  window.pl.send('update:make')
  window.pl.receive('update:downloadProgress', (data) => {
    downloadProgess.value = Math.round(data)
  })
  window.pl.receive('update:error', (data) => {
    updateError.value = data
  })
}
onUnmounted(() => {
  window.pl.removeReceiveListener('update:downloadProgress')
})
// #endregion
</script>
