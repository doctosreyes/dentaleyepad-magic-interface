<template>
  <div>
    <q-select filled v-model="connector" :options="connectorOptions" label="Filled" />
  </div>
</template>
<script setup>
import log from 'electron-log'
import { ref, watch, onUnmounted } from 'vue'

const connector = ref(null)
const connectorOptions = ['Romexis', 'Sidexis']

window.pl
  .getSettingValue('connector')
  .then((result) => (connector.value = result))
  .catch((err) => log.error(err))

onUnmounted(() => {
  window.pl.removeReceiveListener('connector')
})

watch(connector, (val) => {
  window.pl.getSettingValue('connector')
    .then((result) => {
      if (result !== val) {
        window.pl.send('settingSet', { key: 'connector', value: val })
        if (process.env.DEV) {
          log.debug('patmanager RESTART')
          return
        }
        window.pl.send('app:relaunch')
      }
    })
    .catch(err => log.error(err))
})
</script>
