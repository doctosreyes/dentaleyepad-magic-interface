<template>
  <div>
    <div>
      <QrCode />
      <OutputButton class="q-mt-sm" />
    </div>
  </div>
</template>

<script setup>
import QrCode from 'src/components/QrCode.vue'
import { onMounted, onUnmounted } from 'vue'
import log from 'electron-log'
import { useRouter } from 'vue-router'
import OutputButton from 'src/components/buttons/OutputButton.vue'

defineOptions({
  name: 'IndexPage'
})

const router = useRouter()
// #region DccDirDialog
onMounted(() => {
  window.pl.getSettingValue('dccTargetDir')
    .then((res) => {
      log.debug(`IndexPage onMounted dccTargetDir : ${res}`)
      if (res === '') {
        router.push('/setDccTargetDir')
        /* log.debug('open modal to select dcc target dir path')
        const dialogObj = { title: 'Hinweis', message: 'Bitte zuerst Software wählen' }
        const myDialog = new MyDialog(dialogObj)
        log.debug(`dialog object: ${JSON.stringify(myDialog)}`) */
      }
    })
    .catch(err => log.error(err))
})

// #region UPDATE
onMounted(() => {
  window.pl.receive('update:show', (ev, data) => {
    log.debug('MainLayout-> onMounted received update:show')
    router.push('/update')
  })
})
onUnmounted(() => {
  window.pl.removeReceiveListener('update:show')
})
// #endregion
</script>
