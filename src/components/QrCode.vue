<template>
  <div :key="qr" id="qr">
    <div class="" v-html="generateQrCode"></div>
  </div>
  <div v-if="qrNotEmpty">
    <div class="q-pl-md" id="qrData" v-for="(qrData, index) in qrArray" :key="index">
      <div v-if="index === 0 && qrData.length > 0">
        Praxis-Nr.: <span class="q-pl-sm">{{ qrData }}</span>
      </div>
      <div v-if="index === 1">
        ID: <span class="q-pl-sm">{{ qrData }}</span>
      </div>
      <div v-if="index === 2">
        Name: <span class="q-pl-sm">{{ qrData }}</span>
      </div>
      <div v-if="index === 3">
        Vorname: <span class="q-pl-sm">{{ qrData }}</span>
      </div>
      <div v-if="index === 4">
        Geburtsdatum: <span class="q-pl-sm">{{ qrData }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import QRCode from 'qrcode'
import log from 'electron-log/renderer'
import { useQrCodeStore } from '../stores/qr-code-store'
import { storeToRefs } from 'pinia'

const qrCodeStore = useQrCodeStore()
const { qr } = storeToRefs(qrCodeStore)

const qrNotEmpty = computed(() => {
  return qr.value !== ''
})
const qrArray = computed(() => {
  const qrArray = qr.value.split('|')
  return qrArray
})

let qrImage = ''

const generateQrCode = computed(() => {
  if (qr.value !== '') {
    QRCode.toString(qr.value, { type: 'terminal' }, (err, QRcode) => {
      if (err) return log.error('error: ' + err)
      qrImage = QRcode
      log.debug('qrImage: ', qrImage)
    })
  }
  return qrImage
})

/* const openQrCode = () => {
  const newWindow = window.open(
    '',
    '_blank',
    'frame=1, autoHideMenuBar=1, useContentSize=1, width=240, height=300'
  )
  newWindow.document.write(qrImage)
  newWindow.document.write(qr.value)
  newWindow.document.close()
} */

onMounted(() => {
  window.pl.receive('resetQrCode', () => {
    qr.value = ''
    qrImage = ''
  })
  window.pl.receive('args', (args) => {
    log.debug(`QrCode renderer args: ${args}`)
    if (typeof args === 'string') {
      qr.value = args
    } else {
      qr.value = process.env.PROD ? args[2] : args[4]
    }
  })
})

onUnmounted(() => {
  window.pl.removeReceiveListener('args')
  window.pl.removeReceiveListener('resetQrCode')
})
</script>
<style scoped>
#qrData {
  width: 200px;
  margin: 0;
  line-height: 1.2;
}
#qr {
  width: 150px;
  margin: 0;
  padding: 0;
  line-height: 0;
}
</style>
