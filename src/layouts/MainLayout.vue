<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-1">
      <q-toolbar>
        <q-btn flat dense>
          <online-support width="20px" />
          <q-tooltip>
            Some text as content of Tooltip
          </q-tooltip>
        </q-btn>
        <q-btn  style="font-size: 0.5rem" class="text-grey-1 tripleClickButton" flat dense icon="menu" @click="handleClick" />
        <q-toolbar-title style="font-size: 0.6rem" class="q-electron-drag text-grey-9">
          dentaleyepad
        </q-toolbar-title>
        <q-btn class="text-grey-9" style="font-size: 0.5rem" flat round dense @click="closeAppToTray()" icon="close" />
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      :no-hide-on-route-change="true"
      :breakpoint="6000"
      show-if-above
      bordered
    >
      <q-item v-if="devMode" class="q-mt-sm" to="/tests">
        <q-item-section avatar>
          <q-icon name="test" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Test</q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="q-mt-sm" to="/">
        <q-item-section avatar>
          <q-icon name="home" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Home</q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="q-mt-sm" to="/settings">
        <q-item-section avatar>
          <q-icon name="settings" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Settings</q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="q-mt-sm" to="/remoteSupport">
        <q-item-section avatar>
          <q-icon name="settings" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Online Support</q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import log from 'electron-log'
import { useI18n } from 'vue-i18n'
import useTripleClick from '../compopsables/useTripleClick'
import onlineSupport from 'src/assets/onlineSupport.vue'

defineOptions({
  name: 'MainLayout'
})

const { handleClick } = useTripleClick(toggleLeftDrawer)

const devMode = ref(process.env.DEV)

// #region LANGUAGE
const { locale } = useI18n({ useScope: 'global' })
window.pl
  .getSettingValue('language')
  .then((lang) => {
    locale.value = lang
  })
  .catch((err) => log.error(err))
// #endregion LANGUAGE

const closeAppToTray = () => {
  log.debug('closeAppToTray')
  window.pl.send('closeAppToTray')
}

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
<style>
  .button {
    width: 140px;
    margin: 0;
    padding: 0;
  }
  .tripleClickButton {
   cursor: auto;
  }
  .clickable {
    cursor: pointer;
  }
</style>
