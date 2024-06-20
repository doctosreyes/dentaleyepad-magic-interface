<template>
  <q-list>
    <q-item v-if="updateIsAvailable" to="/update">
      <q-item-section>
        <div class="row">
          <q-icon  name="update" size="xs" /><label class="q-ml-md">{{ $t('menu.update') }}</label>
        </div>
      </q-item-section>
    </q-item>
    <!-- <q-item to="/">
      <q-item-section>
        <div class="row">
          <q-icon name="home" size="xs" /><label class="q-ml-md">QR Code</label>
        </div>
      </q-item-section>
    </q-item> -->
    <q-item to="/userSettings">
      <q-item-section>
        <div class="row">
          <q-icon name="settings" size="xs" /><label class="q-ml-md">{{ $t('menu.settings') }}</label>
        </div>
      </q-item-section>
    </q-item>
    <q-item to="/remoteSupport">
      <q-item-section>
        <div class="row">
          <online-support width="18px" /><label class="q-ml-md">online support</label>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script setup>
import onlineSupport from 'src/assets/onlineSupport.vue'
import log from 'electron-log'
import { ref, onMounted } from 'vue'

// #region UPDATE available
const updateIsAvailable = ref(false)
onMounted(() => {
  window.pl.getSettingValue('updateAvailable')
    .then((isAvailable) => {
      updateIsAvailable.value = isAvailable
    })
    .catch(err => log.error(err))
})
// #endregion
</script>
