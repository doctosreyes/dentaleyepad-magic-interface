<template>
  <q-card>
    <q-card-section>
      <p class="relative-position text-subtitle1 text-bold">
        <span style="width: 80%" v-html="t('components.settings.autostart.title')" />
        <q-toggle class="absolute-right" v-model="autoLaunch" color="primary" />
      </p>
      <p
        style="width: 80%"
        class="text-body2"
        v-html="$t('components.settings.autostart.label')"
      />
    </q-card-section>
  </q-card>
</template>
<script setup>
import log from 'electron-log'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// #region AUTOLAUNCH
const autoLaunch = ref(true)
window.pl.getSettingValue('autoLaunch').then((res) => (autoLaunch.value = res))
watch(autoLaunch, (val) => {
  window.pl.getSettingValue('autoLaunch')
    .then((res) => {
      if (val !== res) {
        window.pl.send('settingSet', { key: 'autoLaunch', value: val })
        window.pl.send('appRestart')
      }
    })
    .catch((err) => log.error(err))
})
// #endregion AUTOLAUNCH
</script>
