<template>
  <div>
    <p class="relative-position text-h6">
            {{ $t('remote.title') }}
    </p>
    <div style="width: 80%" class="text-body2">
      {{ $t('remote.hint') }}
    </div>
    <div>
      <q-btn class="q-pa-md q-mr-md q-mt-md button" @click="startRemote('TeamViewerQS.exe')">TeamViewer</q-btn>
      <q-btn class="q-pa-md q-mt-md button" @click="startRemote('SplashtopSOS.exe')">SOS Splashtop</q-btn>
    </div>
  </div>
</template>

<script>
import child from 'child_process'
import path from 'path'
import log from 'electron-log'
import { openURL } from 'quasar'

export default {
  methods: {
    startRemote (remote) {
      const pathOfRemote = path.join(__statics, remote)
      if (process.platform === 'win32') {
        child.execFile(pathOfRemote, (err, data) => {
          if (err) {
            log.error('Remote startRemote ERROR: ', err)
          }
          log.info('startRemote: ', remote)
        })
      } else {
        remote === 'SplashtopSOS.exe' ? openURL('https://www.splashtop.com/de/sos-download') : openURL('https://dentaleyepad.de/wp-content/service_download/TeamViewerQS.dmg')
      }
    }
  }
}
</script>
