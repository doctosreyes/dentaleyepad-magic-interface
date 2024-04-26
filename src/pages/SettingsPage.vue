<template>
  <q-page padding>
    SETTINGS PAGE
    <charly-patient></charly-patient>
    <set-connectors></set-connectors>
  </q-page>
</template>
<script setup>
import CharlyPatient from 'src/components/settings/CharlyPatient.vue'
import SetConnectors from 'src/components/settings/SetConnectors.vue'
</script>
