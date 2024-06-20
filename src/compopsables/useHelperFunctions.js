import log from 'electron-log'
import { storeToRefs } from 'pinia'
import { useUserDrawerStore } from 'src/stores/user-drawer-store'

// #region USER DRAWER
const userDrawer = useUserDrawerStore()
const { open, width, supportDrawerOpen } = storeToRefs(userDrawer)

export default function useHelperFunctions () {
  const getBounds = async () => {
    return await window.pl.invoke('getBounds')
  }
  function closeAppToTray (router) {
    getBounds()
      .then((bounds) => {
        log.debug(`bounds: ${JSON.stringify(bounds)}`)
        log.debug('closeAppToTray')
        log.debug(`ROUTER currentRoute path: ${router.currentRoute.value.path}`)
        if (open.value) {
          open.value = false
          window.pl.send('setBounds', { width: bounds.width - width.value })
        }
        supportDrawerOpen.value = false
        if (router.currentRoute.value.path !== '/') {
          router.push('/')
        }
        window.pl.send('closeAppToTray')
      })
  }

  return {
    closeAppToTray,
    getBounds
  }
}
