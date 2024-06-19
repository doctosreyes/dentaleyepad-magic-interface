<template>
  <q-card>
    <q-btn @click="setDialog">Dialog</q-btn>
  </q-card>
</template>

<script setup>
function setDialog () {
  console.log('TestMyDialog - setDialog')
  const data = {
    text: 'Dies kommt von TestMyDialog',
    onOkCallbackID: 1
  }
  window.pl.send('MainLayoutDialog', data)
}
</script>
