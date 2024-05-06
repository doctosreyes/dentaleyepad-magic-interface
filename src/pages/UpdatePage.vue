<template>
  <q-page padding>
    <q-btn dense flat @click="$router.push('/')" icon="chevron_left">
      <q-tooltip>
        Home
      </q-tooltip>
    </q-btn>
    <q-btn v-if="isUpdateAvailable" @click="makeUpdate">
      download update
    </q-btn>
    <span v-if="showProgress">{{ downloadProgess }} %</span>
    <p v-if="updateError">Error:<br/>{{ updateError }}</p>
  </q-page>
</template>
<script setup>
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
