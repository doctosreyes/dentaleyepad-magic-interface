<template>
  <q-page padding>
    <q-btn class="q-mt-sm q-ml-sm" dense flat @click="$router.push('/')" icon="chevron_left">
      <q-tooltip>
        Home
      </q-tooltip>
    </q-btn>
    <AutoStartSetting></AutoStartSetting>
    <XnView></XnView>
  </q-page>
</template>
<script setup>
import AutoStartSetting from '../components/settings/AutoStartSetting.vue'
import XnView from 'src/components/settings/XnView.vue'
</script>
