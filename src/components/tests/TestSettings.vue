<template>
  <q-btn @click="checkTakeScreenshot">
    TakeScreenshot
  </q-btn>
</template>
<script setup>
import log from 'electron-log'
const checkTakeScreenshot = () => {
  log.debug('checkTakeScreenshot')
}
</script>
