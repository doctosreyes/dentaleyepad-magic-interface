<template>
  <div>
    <q-btn @click="checkAutoUpdate">Check AutoUpdate</q-btn>
  </div>
</template>
<script setup>
const checkAutoUpdate = () => {
  window.pl.send('update:check')
}
</script>
