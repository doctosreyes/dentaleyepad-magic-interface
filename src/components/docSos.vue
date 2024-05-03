<template>
  <div class="q-mt-lg flex flex-center">
    <q-btn class="button" @click="startRemote('SplashtopSOS.exe')">SOS Splashtop</q-btn>
    <q-btn class="button" @click="startRemote('TeamViewerQS.exe')">TeamViewer</q-btn>
    <br/><br/>
    <q-btn dense round @click="$router.push('/')" icon="chevron_left"></q-btn>
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
