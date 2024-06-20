<template>
  <q-page padding>
    <dcc-target-dir></dcc-target-dir>
    <ShortCuts></ShortCuts>
    <CloseButton></CloseButton>
  </q-page>
</template>
<script setup>
import CloseButton from 'src/components/buttons/CloseButton.vue'
import ShortCuts from '../components/settings/ShortCuts.vue'
import DccTargetDir from 'src/components/settings/DccTargetDir.vue'
</script>
