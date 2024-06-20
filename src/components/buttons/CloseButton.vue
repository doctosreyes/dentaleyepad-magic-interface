<template>
  <div>
    <q-btn class="text-white q-mt-sm" rounded unelevated style="background-color: #0090d7" @click="closeAppToTray(router)">{{ $t('close') }}</q-btn>
  </div>
</template>
<script setup>
import useHelperFunctions from 'src/compopsables/useHelperFunctions'
import { useRouter } from 'vue-router'

const { closeAppToTray } = useHelperFunctions()
const router = useRouter()
</script>
