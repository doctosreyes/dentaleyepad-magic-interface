<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated style="background-color: #0090d7">
      <q-toolbar style="padding: 0" @click.self="handleTitleClick">
        <q-btn v-if="hasDccTargetDir" flat round dense @click="toggleLeftDrawer" icon="menu" />
        <q-toolbar-title style="font-size: 0.8rem; padding: 0" class="q-ml-xs q-electron-drag">
         <span v-html="getTitle"></span>
        </q-toolbar-title>
        <q-btn style="font-size: 0.8rem" flat dense @click="closeAppToTray(router)" icon="close" />
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
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useMyDialogStore } from 'src/stores/my-dialog-store'
import { useQuasar } from 'quasar'
import useDccDmiSettings from 'src/compopsables/useDccDmiSettings'
import useHelperFunctions from 'src/compopsables/useHelperFunctions'

defineOptions({
  name: 'MainLayout'
})

// DCC TARGET DIR
const { hasDccTargetDir, getTargetDirPathAndReadData } = useDccDmiSettings()
onMounted(() => {
  getTargetDirPathAndReadData()
})
// #endregion

// #region DIALOG
const { msg } = storeToRefs(useMyDialogStore())
const myDialogStore = useMyDialogStore()
const $q = useQuasar()
const onOkCallbacks = [() => { log.debug('onOkCallback ID 0 from Class OcrScan') }, () => { log.debug('onOkCallback ID 1 from TestDialog') }]
onMounted(() => {
  window.pl.receive('MainLayoutDialog', (data) => {
    const id = data.onOkCallbackID
    msg.value = data.text
    myDialogStore.onOkCallback = onOkCallbacks[id]
    myDialogStore.openMyDialog($q)
  })
})
// #endregion

// #region ROUTER
const router = useRouter()

const getTitle = computed(() => {
  const title = open.value ? 'dentaleyepad-magic-interface' : 'dentaleyepad'
  return title
})

// #region LANGUAGE
const { locale } = useI18n({ useScope: 'global' })
window.pl
  .getSettingValue('language')
  .then((lang) => {
    locale.value = lang
  })
  .catch((err) => log.error(err))
// #endregion LANGUAGE

// #region SUPPORT DRAWER
const handleTitleClick = (event) => {
  log.debug('handleCLick')
  if (event.ctrlKey) {
    log.debug('handleCLick event.ctrlKey')
    supportDrawerOpen.value = !supportDrawerOpen.value
  }
}
// #endregion

const { closeAppToTray, getBounds } = useHelperFunctions()

// #region USER DRAWER
const userDrawer = useUserDrawerStore()
const { open, width, supportDrawerOpen } = storeToRefs(userDrawer)
const userDrawerBreakpoint = 140
const toggleLeftDrawer = () => {
  getBounds()
    .then((bounds) => {
      log.debug(`bounds: ${JSON.stringify(bounds)}`)
      if (open.value) {
        closeLeftDrawer(bounds)
      } else {
        openLeftDrawer(bounds)
      }
    })
}

const openLeftDrawer = (bounds) => {
  window.pl.send('setBounds', { width: bounds.width + width.value })
  open.value = true
}

const closeLeftDrawer = (bounds) => {
  if (router.currentRoute.value.path === '/') window.pl.send('setBounds', { width: bounds.width - width.value })
  closeAppToTray(router)
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
