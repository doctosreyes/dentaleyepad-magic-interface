<template>
  <q-card flat class="q-mt-sm">
    <strong class="q-pa-sm  text-h6">OCR</strong>
    <q-card-section>
      value which has to be in the title of the window to scan
      <q-input outlined v-model="windowTitle"/> <q-btn @click="setWindowTitle" v-if="showWindowTitleBtn">Set New Value</q-btn>
    </q-card-section>
  </q-card>
</template>
<script setup>
import log from 'electron-log'
import { ref, onMounted, watch } from 'vue'

// #region WINDOW NAME
const windowTitle = ref(null)
const showWindowTitleBtn = ref(false)
const setWindowTitle = () => {
  window.pl.send('settingSet', { key: 'windowName', value: windowTitle.value })
}
onMounted(() => {
  window.pl.invoke('getSettingValue', 'windowName')
    .then((/** @type {any} */ res) => {
      windowTitle.value = res
    })
})
watch(windowTitle, (newVal, oldVal) => {
  log.debug(`newVal: ${newVal} / oldVal: ${oldVal}`)
  window.pl.invoke('getSettingValue', 'windowName')
    .then((/** @type {any} */ res) => {
      if (windowTitle.value !== res) {
        showWindowTitleBtn.value = true
      }
    })
})
</script>
