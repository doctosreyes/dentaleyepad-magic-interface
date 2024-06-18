<template>
  <q-card flat>
    <strong class="q-pa-sm text-h6">Charly</strong>
    <q-card-section>
      <p class="relative-position text-subtitle1 text-bold">
      <span style="width: 80%">{{ $t('components.settings.charly.title') }}</span>
      <q-toggle class="absolute-right" v-model="patientFile" color="primary" />
      </p>
      <p v-if="patientFile">
        <strong>{{ $t('file') }} - {{ $t('path') }}:</strong> {{ patientFilePath }}
      </p>
    </q-card-section>

  </q-card>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import log from 'electron-log'

const patientFilePath = ref(null)
onMounted(() => {
  window.pl.getSettingValue('paths.programData')
    .then((res) => {
      const filePath = `${res}\\patient.txt`
      patientFilePath.value = filePath
    })
    .catch(err => log.error(err))
})

const patientFile = ref(false)
window.pl
  .getSettingValue('patientFile')
  .then((res) =>
    typeof res !== 'undefined' ? (patientFile.value = res) : (patientFile.value = false)
  )
watch(patientFile, (val) => {
  window.pl.getSettingValue('patientFile')
    .then((result) => {
      if (result !== val && val === true) {
        window.pl.send('settingSet', { key: 'patientFile', value: val })
      } else if (result !== val && val === false) {
        window.pl.send('settingSet', { key: 'patientFile', value: val })
      }
      if (process.env.DEV) {
        log.debug('patmanager RESTART')
        return
      }
      window.pl.send('app:relaunch')
    })
    .catch(err => log.error(err))
})
</script>
