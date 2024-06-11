<template>
  <q-layout view="lHh Lpr lFf">
    <q-header style="height: 30px" class="bg-grey-1">
      <q-toolbar @click.self="handleTitleClick">
        <UserMenu></UserMenu>
        <q-toolbar-title style="font-size: 0.8rem; padding: 0" class="q-electron-drag text-grey-9">
         <span>dentaleyepad</span>
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
    {{ version }}
      <q-item v-if="devMode" class="q-mt-sm" to="/tests">
        <q-item-section avatar>
          <q-icon name="test" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Test</q-item-label>
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

      <q-item class="q-mt-sm" to="/input">
        <q-item-section avatar>
          <q-icon name="input" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Input</q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="q-mt-sm" to="/output">
        <q-item-section avatar>
          <q-icon name="output" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Output</q-item-label>
        </q-item-section>
      </q-item>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import UserMenu from '../components/UserMenu.vue'
import { ref } from 'vue'
import log from 'electron-log'
import { useI18n } from 'vue-i18n'
import { version } from '../../package.json'

defineOptions({
  name: 'MainLayout'
})

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

// #region TRAY
const closeAppToTray = () => {
  log.debug('closeAppToTray')
  window.pl.send('closeAppToTray')
}
// #endregion

// #region DRAWER
const handleTitleClick = (event) => {
  log.debug('handleCLick')
  if (event.ctrlKey) {
    log.debug('handleCLick event.ctrlKey')
    toggleLeftDrawer()
  }
}
const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
// #endregion
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
