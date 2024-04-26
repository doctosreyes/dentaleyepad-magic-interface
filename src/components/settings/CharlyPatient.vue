<template>
  <div>
    <p class="relative-position text-subtitle1 text-bold">
      <span style="width: 80%">Patient File</span>
      <q-toggle class="absolute-right" v-model="patientFile" color="primary" />
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import log from 'electron-log'

const patientFile = ref(false)
window.pl
  .getSettingValue('patientFile')
  .then((res) =>
    typeof res !== 'undefined' ? (patientFile.value = res) : (patientFile.value = false)
  )
watch(patientFile, (val) => {
  const result = window.pl.getSettingValue('patientFile')
  if (result !== val && val === true) {
    window.pl.send('settingSet', { key: 'patientFile', value: val })
    if (process.env.DEV) {
      log.debug('patmanager RESTART')
      return
    }
    window.pl.send('app:relaunch')
  } else if (result !== val && val === false) {
    window.pl.send('settingSet', { key: 'patientFile', value: val })
  }
})
</script>
