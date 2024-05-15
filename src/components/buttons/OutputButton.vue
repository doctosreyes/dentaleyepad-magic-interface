<template>
  <div>
    <q-btn v-if="outputIsRomexis" @click="startRomexisLoaderBat" class="ouputButton">{{ $t('components.buttons.romexis.label') }}</q-btn>
    <q-btn class="ouputButton" v-else>XnView</q-btn>
  </div>
</template>
<script setup>
import log from 'electron-log'
import { ref, onMounted } from 'vue'

// #region ROMEXIS
const outputIsRomexis = ref(false)
const startRomexisLoaderBat = () => {
  window.pl.send('startRomexisLoaderBat')
}
// #endregion

onMounted(() => {
  window.pl.getSettingValue('output')
    .then((res) => {
      log.debug(`outputIsRomexis: ${res}`)
      if (res === 'Romexis') { outputIsRomexis.value = true }
    })
    .catch(err => log.error(err))
})
</script>
<style scoped>
  .ouputButton {
    position: relative;
    font-size: 0.7rem;
    width: 90%;
    max-height: 44px;
    margin-left: 5%;
  }
</style>
