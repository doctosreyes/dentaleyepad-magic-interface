<template>
  <q-card flat class="">
    <div class="text-h6">
      Shortcuts
    </div>

    <q-card-section>
      <q-input disable id="ocr" v-model="ocr"></q-input>
      <q-btn v-if="showChgBtn">Ändern {{ showChgBtn }}</q-btn>
    </q-card-section>

  </q-card>
</template>
<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import log from 'electron-log'

const shortcuts = ref(null)
const ocr = ref(null)

onMounted(() => {
  window.pl.invoke('getSettingValue', 'shortcuts')
    .then((res) => {
      shortcuts.value = res
      log.debug(`shortcuts: ${JSON.stringify(res)}`)
      ocr.value = res.ocr
    })
})

const showChgBtn = computed(() => {
  if (shortcuts.value !== null) {
    return shortcuts.value.ocr !== ocr.value
  } else {
    return false
  }
})

watch(ocr, (val) => {
  if (val === ocr.value) { showChgBtn.value = true } else { showChgBtn.value = false }
  log.debug(`Watch OCR-SHORTCUT: ${val}`)
})
</script>
