<template>
  <div>
    <q-card flat>
      <div class="text-h6">
        {{ t('components.settings.dccTargetDir.hint') }}
      </div>
      <div class="q-my-sm">
        <q-btn @click="selectDccDirPath">{{ t('components.settings.dccTargetDir.btn') }}</q-btn>
      </div>
      Zielverzeichnis: <!-- TODO translate -->
      <div class="q-mt-xs">
        {{ dccTargetDirPath }}
      </div>
      <div v-if="readError" class="row text-negative">
        <p>
          {{ readError }}
        </p>
      </div>
      <div v-if="warning" class="row text-warning">
        <p>
          {{ warning }}
        </p>
      </div>
      <hr v-if="hasDccTargetDir" />
      <div v-if="hasDccTargetDir"><strong>{{ t('components.settings.dccTargetDir.data') }}</strong></div>
      <div v-if="hasDccTargetDir">
        Connector: {{ dccSettings !== null ? dccSettings.connector : '' }} <br/>
        IPs: {{ dccSettings !== null ? dccSettings.ips : '' }} <br/>
        Output: {{ dccSettings !== null ? dccSettings.output : '' }} <br/>
        OCR Shortcut: {{ ocrShortcut }}
      </div>
    </q-card>
  </div>
</template>
<script setup>
import log from 'electron-log'
import useSelectPath from '../../compopsables/useSelectPath.js'
import { ref, onMounted, watch } from 'vue'
// import axios from 'axios'
import useDccDmiSettings from 'src/compopsables/useDccDmiSettings.js'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// #region OCR Shortcut
const ocrShortcut = ref(null)
onMounted(() => {
  window.pl.invoke('getSettingValue', 'shortcuts')
    .then((res) => {
      ocrShortcut.value = res.ocr
    })
})

const { selectPath, selectedPath } = useSelectPath()
const { hasDccTargetDir, dccSettings, warning, readError, dccTargetDirPath, getTargetDirPathAndReadData } = useDccDmiSettings()
log.debug(`hasDccTargetDir: ${hasDccTargetDir.value}`)
onMounted(() => {
  getTargetDirPathAndReadData()
})

const selectDccDirPath = () => {
  log.debug('selectDccDirPath')
  dccTargetDirPath.value = ''
  readError.value = false
  selectPath({ properties: ['openDirectory'] })
  log.debug(`selectedPath: ${selectedPath.value}`)
}

watch(selectedPath, (filePaths) => {
  log.debug(`DccDirPath -> changed selectedPath: ${JSON.stringify(selectedPath.value)}, filePaths: ${JSON.stringify(filePaths)}`)
  dccTargetDirPath.value = filePaths[0]
  if (typeof dccTargetDirPath.value !== 'undefined') {
    window.pl.send('settingSet', { key: 'dccTargetDir', value: dccTargetDirPath.value })
    window.pl.send('appRestart')
  }
  getTargetDirPathAndReadData()
})
</script>
