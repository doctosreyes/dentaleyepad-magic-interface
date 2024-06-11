<template>
  <q-btn class="q-pl-sm" color="primary" icon="menu" flat style="width: 20px">
    <q-menu max-width="50px" max-height="210px" :offset="[5,-4]">
      <q-list style="min-width: 30px">
        <q-item v-if="updateIsAvailable" clickable v-close-popup>
          <q-item-section>
            <q-btn to="/update" flat padding="none" icon="update" style="width: 20px" />
              <q-tooltip>
                {{ $t('tooltips.update') }}
              </q-tooltip>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>
            <q-btn to="/" flat padding="none" icon="home" style="width: 20px" />
              <q-tooltip>
                Home
              </q-tooltip>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>
            <q-btn to="/userSettings" flat padding="none" icon="settings" style="width: 20px">
            </q-btn>
            <q-tooltip>
              {{ $t('tooltips.settings') }}
            </q-tooltip>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>
            <online-support width="20px" />
              <q-tooltip>
                Online-Support
              </q-tooltip>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <q-tooltip>
        Menu
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import log from 'electron-log'
import onlineSupport from 'src/assets/onlineSupport.vue'

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
