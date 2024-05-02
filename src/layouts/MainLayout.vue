<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="text-body1 q-electron-drag">
          dentaleyepad
        </q-toolbar-title>
        <q-btn flat round dense @click="closeAppToTray()" icon="close" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :no-hide-on-route-change="true"
      :breakpoint="599"
      show-if-above
      bordered
    >
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

const { locale } = useI18n({ useScope: 'global' })

window.pl.getSettingValue('language')
  .then((lang) => {
    locale.value = lang
  })
  .catch(err => log.error(err))

const closeAppToTray = () => {
  log.debug('closeAppToTray')
  window.pl.send('closeAppToTray')
}

defineOptions({
  name: 'MainLayout'
})

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
