<template>
  <div>
    <q-img v-if="showHourglass" class="q-mt-lg q-mb-lg" width="150px" src="~assets/hourglass.gif"></q-img>
    <QrCode v-else />
    <OutputButton class="q-mt-sm" />
  </div>
</template>

<script setup>
import QrCode from 'src/components/QrCode.vue'
import { onMounted, onUnmounted, ref } from 'vue'
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

// #region TAKE SCREENSHOT
const showHourglass = ref(false)
onMounted(() => {
  window.pl.receive('showHourglass', (data) => {
    log.debug(`IndexPage-> onMounted received showHourglass: ${data}`)
    showHourglass.value = data
  })
  window.pl.receive('args', () => {
    log.debug('IndexPage-> onMounted received args')
    showHourglass.value = false
  })
})
onUnmounted(() => {
  window.pl.removeReceiveListener('showHourglass')
})

// #endregion

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
