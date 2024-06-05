<template>
  <q-card>
    <q-card-section>
      <q-input v-model="xnviewPath" />
      <q-btn @click="selectPath">Pfad zu XnView.exe</q-btn>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import log from 'electron-log'
import useSelectPath from 'src/compopsables/useSelectPath'

const { selectPath, selectedPath } = useSelectPath()
watch(selectedPath, (val) => {
  log.debug(`selectedPath: ${val}`)

  if (typeof val === 'undefined') {
    getXnViewPath()
  } else {
    xnviewPath.value = val[0]
    window.pl.send('settingSet', { key: 'paths.xnview', value: xnviewPath.value })
    getXnViewPath()
  }
})

const xnviewPath = ref(null)

const getXnViewPath = () => {
  window.pl.getSettingValue('paths.xnview')
    .then((res) => {
      xnviewPath.value = res
    }).catch(err => { log.error(err) })
}

onMounted(() => {
  getXnViewPath()
})

</script>
