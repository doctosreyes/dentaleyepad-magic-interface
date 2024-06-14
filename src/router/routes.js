import { useUserDrawerStore } from 'src/stores/user-drawer-store'
import log from 'electron-log'

const bounds = { width: 800, height: 600 }

const qrCodeWidth = 154
const qrCodeHeight = 260

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        beforeEnter: (to, from) => {
          const userDrawer = useUserDrawerStore()
          const qrCodeBounds = userDrawer.open ? { width: userDrawer.width + qrCodeWidth, height: qrCodeHeight } : { width: qrCodeWidth, height: qrCodeHeight }
          log.debug(`routes.js userDrawerWidth: ${userDrawer.width}`)
          window.pl.send('setBounds', qrCodeBounds)
        }
      },
      {
        path: 'remoteSupport',
        component: () => import('pages/RemoteSupportPage.vue'),
        beforeEnter: (to, from) => {
          window.pl.send('setBounds', bounds)
        }
      },
      {
        path: 'update',
        component: () => import('pages/UpdatePage.vue'),
        beforeEnter: (to, from) => {
          window.pl.send('setBounds', bounds)
        }
      },
      {
        path: 'settings',
        component: () => import('pages/SettingsPage.vue'),
        beforeEnter: (to, from) => {
          window.pl.send('setBounds', bounds)
        }
      },
      {
        path: 'userSettings',
        component: () => import('pages/UserSettingsPage.vue'),
        beforeEnter: (to, from) => {
          window.pl.send('setBounds', bounds)
        }
      },
      {
        path: 'input',
        component: () => import('pages/InputPage.vue'),
        beforeEnter: (to, from) => {
          window.pl.send('setBounds', bounds)
        }
      },
      {
        path: 'output',
        component: () => import('pages/OutputPage.vue'),
        beforeEnter: (to, from) => {
          window.pl.send('setBounds', bounds)
        }
      },
      {
        path: 'tests',
        component: () => import('pages/TestsPage.vue'),
        beforeEnter: (to, from) => {
          window.pl.send('setBounds', bounds)
        }
      },
      {
        path: 'setDccTargetDir',
        component: () => import('pages/SetDccTargetDirPage.vue'),
        beforeEnter: (to, from) => {
          window.pl.send('setBounds', bounds)
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
