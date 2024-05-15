<template>
  <div>
    <q-select filled v-model="output" :options="outputOptions" label="Filled" />
  </div>
</template>
<script setup>
import log from 'electron-log'
import { ref, watch } from 'vue'

const output = ref(null)
const outputOptions = ['XnView MP (Standard)', 'Sidexis', 'Romexis', 'dentaleyepad media manager']

window.pl
  .getSettingValue('output')
  .then((result) => (output.value = result))
  .catch((err) => log.error(err))

watch(output, (val) => {
  window.pl.getSettingValue('output')
    .then((result) => {
      if (result !== val) {
        window.pl.send('settingSet', { key: 'output', value: val })
        if (process.env.DEV) {
          log.debug('patient-grabber RESTART')
          return
        }
        window.pl.send('app:relaunch')
      }
    })
    .catch(err => log.error(err))
})
</script>
