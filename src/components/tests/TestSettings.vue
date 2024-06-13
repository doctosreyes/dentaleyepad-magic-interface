<template>
  OCR-Scan
  <q-btn @click="checkTakeScreenshot">
    TakeScreenshot
  </q-btn>
  <!-- <q-btn @click="checkRegisterShortcut">
    Register Shortcut
  </q-btn> -->
</template>
<script setup>
import log from 'electron-log'

const checkTakeScreenshot = () => {
  log.debug('checkTakeScreenshot')
  window.pl.send('takeScreenshot', 'TEST')
}

/* const checkRegisterShortcut = () => {
  log.debug('checkRegisterShortcut')
  window.pl.send('registerShortcut', 'TEST')
} */
</script>
