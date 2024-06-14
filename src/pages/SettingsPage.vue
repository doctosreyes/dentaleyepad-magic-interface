<template>
  <q-page padding>
    <QrCodeButton></QrCodeButton>
    <AutoStartSetting></AutoStartSetting>
    <XnView></XnView>
  </q-page>
</template>
<script setup>
import QrCodeButton from 'src/components/buttons/QrCodeButton.vue'
import AutoStartSetting from '../components/settings/AutoStartSetting.vue'
import XnView from 'src/components/settings/XnView.vue'
</script>
