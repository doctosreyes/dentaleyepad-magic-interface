<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated style="background-color: #0090d7">
      <q-toolbar style="padding: 0" @click.self="handleTitleClick">
        <q-btn flat round dense @click="toggleLeftDrawer" icon="menu" />
        <q-toolbar-title style="font-size: 0.8rem; padding: 0" class="q-ml-xs q-electron-drag">
         <span v-html="getTitle"></span>
        </q-toolbar-title>
        <q-btn style="font-size: 0.8rem" flat dense @click="closeAppToTray()" icon="close" />
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="supportDrawerOpen"
      :width="200"
      :breakpoint="userDrawerBreakpoint"
      class="bg-blue-2"
    >
      <SupportMenu></SupportMenu>
    </q-drawer>
    <q-drawer
      v-model="userDrawer.open"
      :width="200"
      :breakpoint="userDrawerBreakpoint"
      class="bg-blue-1"
    >
      <UserMenu></UserMenu>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import UserMenu from '../components/menus/UserMenu.vue'
import SupportMenu from '../components/menus/SupportMenu.vue'
import log from 'electron-log'
import { useUserDrawerStore } from 'src/stores/user-drawer-store'
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()

defineOptions({
  name: 'MainLayout'
})

const getTitle = computed(() => {
  const title = open.value ? 'dentaleyepad-magic-interface' : 'dentaleyepad'
  return title
})

// #region SCREENSHOT
onMounted(() => {
  window.pl.receive('takeScreenshot', async (data) => {
    log.debug(`MainLayout takeScreenhot data: ${JSON.stringify(data)}`)
  })
})

// #endregion

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
  log.debug(`ROUTER currentRoute path: ${router.currentRoute.value.path}`)
  if (router.currentRoute.value.path !== '/') {
    router.push('/')
  }
  supportDrawerOpen.value = false
  window.pl.send('closeAppToTray')
}
// #endregion

// #region SUPPORT DRAWER
const supportDrawerOpen = ref(false)
const handleTitleClick = (event) => {
  log.debug('handleCLick')
  if (event.ctrlKey) {
    log.debug('handleCLick event.ctrlKey')
    supportDrawerOpen.value = !supportDrawerOpen.value
  }
}
// #endregion

// #region USER DRAWER
const userDrawer = useUserDrawerStore()
const { open, width } = storeToRefs(userDrawer)
const getBounds = async () => {
  return await window.pl.invoke('getBounds')
}
const userDrawerBreakpoint = 140
const toggleLeftDrawer = () => {
  getBounds()
    .then((bounds) => {
      log.debug(`bounds: ${JSON.stringify(bounds)}`)
      if (open.value) {
        window.pl.send('setBounds', { width: bounds.width - width.value })
        open.value = false
      } else {
        window.pl.send('setBounds', { width: bounds.width + width.value })
        open.value = true
      }
    })
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
