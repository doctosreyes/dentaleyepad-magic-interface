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

<script setup>
import { openURL } from 'quasar'
import constants from '../../constants.json'
import log from 'electron-log'

const startRemote = (app) => {
  const processPlatform = window.pl.processPlatform
  log.debug(`platform = ${processPlatform}`)
  if (processPlatform === 'win32') { // IF OS !== MacOS
    app === 'SplashtopSOS.exe' ? openURL(constants.remote.sos, undefined, {
      title: `Download ${app} - dentaleyepad - doctorseyes GmbH`,
      center: true
    }) : openURL(constants.remote.qs)
  } else {
    app === 'SplashtopSOS.exe' ? openURL('https://www.splashtop.com/de/sos-download') : openURL('https://dentaleyepad.de/wp-content/service_download/TeamViewerQS.dmg')
  }
}
</script>
