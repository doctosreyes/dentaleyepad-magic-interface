import log from 'electron-log'
import { storeToRefs } from 'pinia'
import { useUserDrawerStore } from 'src/stores/user-drawer-store'

// #region USER DRAWER
const userDrawer = useUserDrawerStore()
const { open, supportDrawerOpen } = storeToRefs(userDrawer)

export default function useHelperFunctions () {
  const getBounds = async () => {
    return await window.pl.invoke('getBounds')
  }
  function closeAppToTray (router) {
    log.debug('closeAppToTray')
    log.debug(`ROUTER currentRoute path: ${router.currentRoute.value.path}`)
    if (open.value) {
      open.value = false
    }
    supportDrawerOpen.value = false
    if (router.currentRoute.value.path !== '/') {
      router.push('/')
    } else {
      window.pl.send('setBounds', { width: userDrawer.qrCodeBounds.width, height: userDrawer.qrCodeBounds.height })
    }
    window.pl.send('closeAppToTray')
  }

  return {
    closeAppToTray,
    getBounds
  }
}
