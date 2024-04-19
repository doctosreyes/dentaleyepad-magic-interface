<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="q-electron-drag">
          {{ appTitle }}
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
    <q-item class="q-mt-sm" to="/settings">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Settings</q-item-label>
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
import constants from '../../constants.json'
import log from 'electron-log'

const appTitle = constants.app.title

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
