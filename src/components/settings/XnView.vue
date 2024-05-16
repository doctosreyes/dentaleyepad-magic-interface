<template>
  <div>
    <q-input v-model="pathXnView" />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import log from 'electron-log'

const pathXnView = ref(null)
onMounted(() => {
  window.pl.getSettingValue('paths.xnview')
    .then((res) => {
      pathXnView.value = res
    }).catch(err => { log.error(err) })
})

</script>
