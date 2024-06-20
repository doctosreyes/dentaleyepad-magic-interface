import { useUserDrawerStore } from 'src/stores/user-drawer-store'
import log from 'electron-log'

const sendBounds = () => {
  const userDrawer = useUserDrawerStore()
  window.pl.send('setBounds', { width: userDrawer.bounds.width, height: userDrawer.bounds.height })
}

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
          if (userDrawer.open) userDrawer.open = false
          const qrCodeBounds = userDrawer.open ? { width: userDrawer.width + userDrawer.qrCodeBounds.width, height: userDrawer.qrCodeBounds.height } : { width: userDrawer.qrCodeBounds.width, height: userDrawer.qrCodeBounds.height }
          log.debug(`routes.js userDrawerWidth: ${JSON.stringify(userDrawer.qrCodeBounds)}`)
          window.pl.send('setBounds', qrCodeBounds)
        }
      },
      {
        path: 'remoteSupport',
        component: () => import('pages/RemoteSupportPage.vue'),
        beforeEnter: (to, from) => {
          sendBounds()
        }
      },
      {
        path: 'update',
        component: () => import('pages/UpdatePage.vue'),
        beforeEnter: (to, from) => {
          sendBounds()
        }
      },
      {
        path: 'settings',
        component: () => import('pages/SettingsPage.vue'),
        beforeEnter: (to, from) => {
          sendBounds()
        }
      },
      {
        path: 'userSettings',
        component: () => import('pages/UserSettingsPage.vue'),
        beforeEnter: (to, from) => {
          sendBounds()
        }
      },
      {
        path: 'input',
        component: () => import('pages/InputPage.vue'),
        beforeEnter: (to, from) => {
          sendBounds()
        }
      },
      {
        path: 'output',
        component: () => import('pages/OutputPage.vue'),
        beforeEnter: (to, from) => {
          sendBounds()
        }
      },
      {
        path: 'tests',
        component: () => import('pages/TestsPage.vue'),
        beforeEnter: (to, from) => {
          sendBounds()
        }
      },
      {
        path: 'setDccTargetDir',
        component: () => import('pages/SetDccTargetDirPage.vue'),
        beforeEnter: (to, from) => {
          sendBounds()
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
